import { Router } from 'express';
import {
  getAccounts,
  connectAccount,
  syncAccount,
  disconnectAccount
} from '../controllers/accounts.controller.js';

const router = Router();

router.get('/', getAccounts);
router.post('/connect', connectAccount);
router.post('/:id/sync', syncAccount);
router.delete('/:id', disconnectAccount);

export default router;
