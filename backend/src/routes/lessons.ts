import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/lessons/:level
router.get('/:level', async (req: AuthRequest, res: Response) => {
  const levelId = 'L' + req.params.level;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { levelId },
      orderBy: { order: 'asc' }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// GET /api/lessons/progress
router.get('/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      select: { lessonId: true }
    });
    res.json(progress.map(p => p.lessonId));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/lessons/:id/complete
router.post('/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await prisma.userProgress.upsert({
      where: {
        id: `up_${userId}_${id}` // Deterministic ID for upsert
      },
      update: {},
      create: { 
        id: `up_${userId}_${id}`,
        userId, 
        lessonId: id 
      }
    });

    // Award XP or update streak here if needed
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;
