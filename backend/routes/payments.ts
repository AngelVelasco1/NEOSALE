import { Router } from 'express';
import { addPayment } from '../controllers/payments';
import { authMiddleware } from '../middlewares/auth';


export const paymentRoutes = () => {
    const router = Router();
    router.post('/addPayment', authMiddleware.verifyToken, addPayment.processPayment);
    return router;
}

