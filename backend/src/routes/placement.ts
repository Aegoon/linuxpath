import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/questions', async (req: Request, res: Response) => {
  try {
    const questions = [
      { id: '1', text: 'What command lists files in a directory?', options: ['ls', 'dir', 'list', 'show'], correct: 'ls' },
      { id: '2', text: 'What command changes directory?', options: ['cd', 'chdir', 'move', 'go'], correct: 'cd' },
      { id: '3', text: 'What command shows current directory?', options: ['pwd', 'cwd', 'where', 'path'], correct: 'pwd' },
      { id: '4', text: 'What command creates a new directory?', options: ['mkdir', 'newdir', 'createdir', 'makedir'], correct: 'mkdir' },
      { id: '5', text: 'What command removes a file?', options: ['rm', 'del', 'remove', 'delete'], correct: 'rm' },
      { id: '6', text: 'What command copies a file?', options: ['cp', 'copy', 'duplicate', 'clone'], correct: 'cp' },
      { id: '7', text: 'What command shows file contents?', options: ['cat', 'show', 'read', 'print'], correct: 'cat' },
      { id: '8', text: 'What does chmod do?', options: ['Changes permissions', 'Changes owner', 'Changes name', 'Changes size'], correct: 'Changes permissions' },
      { id: '9', text: 'What command searches text in files?', options: ['grep', 'find', 'search', 'locate'], correct: 'grep' },
      { id: '10', text: 'What command shows running processes?', options: ['ps', 'proc', 'tasks', 'jobs'], correct: 'ps' }
    ];
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.post('/submit', requireAuth, async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;
    const correct = ['ls','cd','pwd','mkdir','rm','cp','cat','Changes permissions','grep','ps'];
    const score = answers.filter((a: string, i: number) => a === correct[i]).length;
    const level = score <= 2 ? 'l1' : score <= 4 ? 'l2' : score <= 6 ? 'l3' : score <= 8 ? 'l4' : 'l5';

    await prisma.userLevel.upsert({
      where: { id: `${req.user!.id}-placement` },
      update: { levelId: level },
      create: { id: `${req.user!.id}-placement`, userId: req.user!.id, levelId: level }
    });

    res.json({ score, total: 10, level });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit placement test' });
  }
});

export default router;
