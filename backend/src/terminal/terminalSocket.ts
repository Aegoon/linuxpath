import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function initTerminalSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Terminal client connected:', socket.id);

    socket.on('terminal:input', (data: string) => {
      // Echo back for now — Docker integration added later
      socket.emit('terminal:output', data);
    });

    socket.on('disconnect', () => {
      console.log('Terminal client disconnected:', socket.id);
    });
  });

  return io;
}
