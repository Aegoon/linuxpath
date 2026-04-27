import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/create-checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    // Stripe integration — add STRIPE_SECRET_KEY to enable
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: 'Billing not configured yet' });
    }
    res.json({ url: '/pricing' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    res.json({ subscriptionActive: false, plan: 'free' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get billing status' });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  // Stripe webhook handler
  res.json({ received: true });
});

export default router;
