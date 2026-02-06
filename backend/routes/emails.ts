import { Router } from 'express';
import {
  handleSendOrderConfirmation,
  handleSendPasswordReset,
  handleSendVerificationEmail,
} from '../controllers/emails.js';

const router = Router();

// Send order confirmation email
router.post('/order-confirmation', handleSendOrderConfirmation);

// Send password reset email
router.post('/password-reset', handleSendPasswordReset);

// Send verification email
router.post('/verification', handleSendVerificationEmail);

export default router;
