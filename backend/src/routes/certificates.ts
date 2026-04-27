import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      include: { level: true }
    });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

router.get('/:levelId/pdf', requireAuth, async (req: Request, res: Response) => {
  try {
    const cert = await prisma.certificate.findFirst({
      where: { userId: req.user!.id, levelId: req.params.levelId },
      include: { level: true, user: true }
    });
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });

    res.json({
      message: 'PDF generation coming soon',
      certificate: cert
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

export default router;
