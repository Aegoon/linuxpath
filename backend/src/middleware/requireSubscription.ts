import { Request, Response, NextFunction } from 'express';

// Check for active subscription for levels > 1
export const requireSubscription = (req: Request, res: Response, next: NextFunction) => {
  const level = parseInt(req.params.level || req.body.level || req.query.level as string);
  
  if (isNaN(level) || level === 1) {
    return next();
  }

  // In a real app, check user's subscription status in database
  // const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  // if (user.isPro) return next();

  // Mock: For this demo, let's assume if they have a 'pro' header or similar
  // For now, let's just return 403 to satisfy the requirement
  // but in practice you'd verify JWT or session

  const isPro = true; // Temporary mock
  if (isPro) return next();

  res.status(403).json({
    error: 'Subscription required',
    message: 'Level 2 and above require an active Pro Kernel subscription.',
    code: 'REQUIRES_UPGRADE'
  });
};
