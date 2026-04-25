import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { setupTerminalSocket } from "./terminal/terminalSocket";
import lessonsRouter from "./routes/lessons";
import labsRouter from "./routes/labs";
import dashboardRouter from "./routes/dashboard";
import certificatesRouter from "./routes/certificates";
import billingRouter from "./routes/billing";
import adminRouter from "./routes/admin";
import prisma from "./lib/prisma";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Questions data path
const QUESTIONS_PATH = path.join(__dirname, "..", "..", "content", "questions.json");

function getQuestions() {
  try {
    const data = fs.readFileSync(QUESTIONS_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading questions:", err);
    return [];
  }
}

async function startServer() {
  const app = express();
  app.use(cors());
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Setup Real Terminal Socket
  setupTerminalSocket(io);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "LinuxPath API is running" });
  });

  app.use("/api/lessons", lessonsRouter);
  app.use("/api/labs", labsRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/admin", adminRouter);

  // Fetch placement questions
  app.get("/api/placement-test", (req, res) => {
    const questions = getQuestions().map((q: any) => {
      const { answer, ...rest } = q; // Don't send answers to client
      return rest;
    });
    res.json(questions);
  });

  // Submit placement test
  app.post("/api/placement/submit", async (req, res) => {
    try {
      const { userId, answers } = req.body;
      const questions = getQuestions();
      
      let score = 0;
      questions.forEach((q: any) => {
        if (answers[q.id] === q.answer) {
          score++;
        }
      });

      let level = 1;
      if (score >= 9) level = 5;
      else if (score >= 7) level = 4;
      else if (score >= 5) level = 3;
      else if (score >= 3) level = 2;
      else level = 1;

      // Save to database
      const user = await prisma.user.upsert({
        where: { id: userId || 'demo-user' },
        update: { 
          levels: {
            upsert: {
              where: { id: 'l_assigned_' + (userId || 'demo-user') }, // Need a deterministic ID for upsert in relation
              update: { levelId: 'L' + level },
              create: { id: 'l_assigned_' + (userId || 'demo-user'), levelId: 'L' + level }
            }
          }
        },
        create: {
          id: userId || 'demo-user',
          email: 'user@example.com',
          levels: {
            create: { id: 'l_assigned_' + (userId || 'demo-user'), levelId: 'L' + level }
          }
        }
      });

      // Record activity
      await prisma.userActivity.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {},
        create: {
          userId: user.id,
          date: new Date(new Date().setHours(0, 0, 0, 0))
        }
      });
      
      res.json({
        score,
        level,
        message: `Congratulations! You've been assigned Level ${level}.`,
        nextSteps: level === 5 
          ? "You are a master! Try our SysAdmin modules." 
          : "We'll build your foundation from here."
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Failed to process results" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "..", "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`LinuxPath Server running on http://localhost:${PORT}`);
  });
}

startServer();
