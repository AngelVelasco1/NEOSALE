import type { Request, Response, NextFunction } from 'express';
import {
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../services/emails.js';

export async function handleSendOrderConfirmation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await sendOrderConfirmationEmail(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleSendPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await sendPasswordResetEmail(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleSendVerificationEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await sendVerificationEmail(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
