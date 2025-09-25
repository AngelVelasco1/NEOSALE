import { Router } from "express";
import {
  addPaymentController,
  handleWebhookController,
  getPaymentStatusController,
  handleSuccessController,
  handleFailureController,
  handlePendingController,
  createPreferenceController,
  getPreferenceController,
} from "../controllers/payments";

export const paymentRoutes = () => {
  const router = Router();

  router.post("/addPayment", addPaymentController);
  router.post("/webhook", handleWebhookController);
  router.get("/payment/:id", getPaymentStatusController);

  router.get("/success", handleSuccessController);
  router.get("/failure", handleFailureController);
  router.get("/pending", handlePendingController);

  router.post("/create-preference", createPreferenceController);
  router.get("/preference/:id", getPreferenceController);

  return router;
};
