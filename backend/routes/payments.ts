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
  // 🏦 PSE CONTROLLERS
  getFinancialInstitutionsController,
  createPSEPaymentController,
} from "../controllers/payments";

export const paymentsRoutes = () =>
  Router()
    .get("/acceptance-tokens", getAcceptanceTokensController)
    .get("/config", getPaymentConfigController)
    .get("/test-connection", testWompiConnectionController)
    .get("/transaction/:transactionId", getTransactionStatusController)
    .get("/payment/db/:transactionId", getPaymentFromDatabaseController)
    // 🏦 PSE ROUTES
    .get("/pse/financial-institutions", getFinancialInstitutionsController)
    .post("/pse/create-transaction", createPSEPaymentController)
    // 💳 CARD & GENERAL ROUTES
    .post("/generate-signature", generateIntegritySignatureController)
    .post("/create-transaction", createPaymentController)
    .post("/validate-data", validateWompiDataController)
    .post("/webhook", handleWompiWebhookController)
    .post("/orders/create-from-payment", createOrderFromPaymentController)
    .post("/update-status", updatePaymentStatusController)
    .put("/payment/:transactionId/status", updatePaymentStatusController);
