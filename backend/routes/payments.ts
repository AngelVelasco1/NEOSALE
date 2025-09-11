import { Router } from 'express';
import { addPayment } from '../controllers/payments';


export const paymentRoutes = () => {
    const router = Router();
    router.post('/addPayment', addPayment.processPayment);
    return router;
}

