import { Router } from 'express';
import prisma from '../lib/prisma';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

// Apply admin check to all routes in this file
router.use(requireAdmin);

// PAGE 1: Overview
router.get('/overview', async (req, res) => {
  try {
    const [
      totalUsers,
      totalUsersLastWeek,
      proUsers,
      lessonProgress,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.userProgress.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: true,
          levels: { include: { level: true } }
        }
      })
    ]);

    // Mock MRR and chart data since we don't have real stripe transactions table yet
    const mrr = proUsers * 12; // Basic mock
    const completionRate = 68; // Mock avg completion rate

    res.json({
      metrics: {
        totalUsers,
        usersThisWeek: totalUsersLastWeek,
        mrr,
        proSubscribers: proUsers,
        completionRate
      },
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarInitials: u.avatarInitials,
        plan: u.subscription?.status === 'active' ? 'Pro' : 'Free',
        level: u.levels[0]?.level.name || 'Level 1',
        joinedAt: u.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// PAGE 2: Users
router.get('/users', async (req, res) => {
  const { search, filter } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: search ? [
          { name: { contains: search as string } },
          { email: { contains: search as string } }
        ] : undefined,
        subscription: filter === 'Pro' ? { status: 'active' } : undefined,
        isBanned: filter === 'Banned' ? true : undefined
      },
      include: {
        subscription: true,
        levels: { include: { level: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        subscription: true,
        levels: { include: { level: true } },
        progress: { include: { lesson: true } },
        certificates: { include: { level: true } },
        quizAttempts: { include: { lesson: true } }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users/:id/upgrade', async (req, res) => {
  try {
    await prisma.subscription.upsert({
      where: { userId: req.params.id },
      update: { status: 'active' },
      create: {
        userId: req.params.id,
        stripeCustomerId: 'manual_' + Date.now(),
        stripePriceId: 'manual_pro',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

router.post('/users/:id/ban', async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

router.post('/users/:id/reset', async (req, res) => {
  try {
    await prisma.userProgress.deleteMany({ where: { userId: req.params.id } });
    await prisma.quizAttempt.deleteMany({ where: { userId: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

// PAGE 3: Courses (Levels & Lessons)
router.get('/levels', async (req, res) => {
  try {
    const levels = await prisma.level.findMany({
      include: {
        _count: { select: { lessons: true } }
      },
      orderBy: { order: 'asc' }
    });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

router.get('/levels/:id/lessons', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { levelId: req.params.id },
      orderBy: { order: 'asc' }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

router.post('/lessons', async (req, res) => {
  try {
    const lesson = await prisma.lesson.create({
      data: req.body
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

router.patch('/lessons/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// PAGE 5: Containers (Docker Monitor)
router.get('/containers/stats', async (req, res) => {
  // Mock docker stats
  res.json({
    total: 42,
    idle: 12,
    avgCpu: 15.4,
    avgMemory: 450,
    containers: [
      { id: 'cnt_123', student: 'test@example.com', createdAt: new Date(), cpu: 12.5, memory: 450, status: 'running' },
      { id: 'cnt_456', student: 'dev@linuxpath.com', createdAt: new Date(), cpu: 2.1, memory: 120, status: 'idle' }
    ]
  });
});

// PAGE 6: Settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await prisma.platformSettings.findFirst();
    if (!settings) {
      settings = await prisma.platformSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const settings = await prisma.platformSettings.update({
      where: { id: 1 },
      data: req.body
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
