import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware as requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/sync', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id, email, name } = req.user!;
    const avatarInitials = name
      ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : email.substring(0, 2).toUpperCase();

    const user = await prisma.user.upsert({
      where: { id },
      update: { email, name, avatarInitials },
      create: { id, email, name, avatarInitials }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
