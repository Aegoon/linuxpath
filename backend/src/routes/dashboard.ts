import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Get or create user
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        levels: { include: { level: true } },
        _count: { select: { activity: true } }
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: req.user?.email || 'unknown@example.com',
          levels: { create: { levelId: 'L1' } }
        },
        include: {
          levels: { include: { level: true } },
          _count: { select: { activity: true } }
        }
      });
    }

    const currentLevelId = user.levels[0]?.levelId || 'L1';
    const currentLevelNum = parseInt(currentLevelId.replace('L', ''));

    // Fetch progress
    const progressCount = await prisma.userProgress.count({
      where: { userId }
    });

    const activeDays = await prisma.userActivity.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
      take: 7
    });

    const certificates = await prisma.certificate.findMany({
      where: { userId }
    });

    // For levels, we can have a static list or fetch from DB
    const levels = [
      { id: "l1", name: "Linux Novice", total: 10 },
      { id: "l2", name: "File Master", total: 12 },
      { id: "l3", name: "SysAdmin Pro", total: 15 },
      { id: "l4", name: "Network Architect", total: 14 },
      { id: "l5", name: "Kernel Hacker", total: 20 }
    ];

    res.json({
      user: {
        name: req.user?.email?.split('@')[0] || "User",
        avatarInitials: req.user?.email?.substring(0, 2).toUpperCase() || "U",
        levelLabel: `Level ${currentLevelNum}: ${user.levels[0]?.level.name || 'Explorer'}`,
        memberSince: user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isPro: true
      },
      stats: {
        lessonsCompleted: progressCount,
        streakDays: user._count.activity,
        avgQuizScore: 85, // Placeholder
        certificatesCount: certificates.length
      },
      weeklyActivity: activeDays.map(d => d.date.toISOString().split('T')[0]),
      levels: levels.map((lvl, idx) => {
        const levelNum = idx + 1;
        let status = 'locked';
        if (levelNum < currentLevelNum) status = 'complete';
        else if (levelNum === currentLevelNum) status = 'in-progress';

        return {
          ...lvl,
          done: levelNum < currentLevelNum ? lvl.total : (levelNum === currentLevelNum ? progressCount % lvl.total : 0),
          status
        };
      }),
      certificates: levels.slice(0, 2).map(lvl => {
        const cert = certificates.find(c => c.levelId === lvl.id);
        return {
          levelId: lvl.id,
          levelName: lvl.name,
          isEarned: !!cert,
          issueDate: cert ? cert.issuedAt.toISOString().split('T')[0] : null
        };
      })
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

export default router;
