import { Router } from "express";
import {
  getAcceptanceTokensController,
  getPaymentConfigController,
  testWompiConnectionController,
  generateIntegritySignatureController,
  createPaymentController,
  validateWompiDataController,
  getTransactionStatusController,
  updatePaymentStatusController,
  getPaymentFromDatabaseController,
  handleWompiWebhookController,
  createOrderFromPaymentController,
} from "../controllers/payments";

import { authenticateToken } from "../middlewares/auth";

export const paymentsRoutes = () =>
  Router()
    .get("/acceptance-tokens", getAcceptanceTokensController)
    .get("/config", getPaymentConfigController)
    .get("/test-connection", testWompiConnectionController)
    .get("/transaction/:transactionId", getTransactionStatusController)
    .get("/payment/db/:transactionId", getPaymentFromDatabaseController)
    .post("/generate-signature", generateIntegritySignatureController)
    .post("/create-transaction", createPaymentController)
    .post("/validate-data", validateWompiDataController)
    .post("/webhook", handleWompiWebhookController)
    .post("/orders/create-from-payment", createOrderFromPaymentController)
    .put("/payment/:transactionId/status", updatePaymentStatusController);
