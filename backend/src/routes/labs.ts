import { Router } from 'express';
import { getContainerId } from '../terminal/terminalService';
import { validateChallenge } from '../terminal/validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const CHALLENGES_PATH = path.join(__dirname, '..', '..', '..', 'content', 'levels', 'l1', 'challenges.json');

function getChallenges() {
  try {
    const data = fs.readFileSync(CHALLENGES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading challenges:', err);
    return [];
  }
}

router.post('/:challengeId/check', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const challenges = getChallenges();
    const challenge = challenges.find((c: any) => c.id === challengeId);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const containerId = getContainerId(userId);
    if (!containerId) {
      return res.status(400).json({ error: 'No active sandbox found for user' });
    }

    const result = await validateChallenge(containerId, challenge.checkScript);
    
    res.json({
      passed: result.passed,
      hints: challenge.hints,
      answer: challenge.answer // Optional: only show after multiple failures on frontend
    });
  } catch (err) {
    console.error('Validation route error:', err);
    res.status(500).json({ error: 'Failed to validate challenge' });
  }
});

export default router;
