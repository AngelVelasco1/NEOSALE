import { Router } from "express";
import {
  getAcceptanceTokensController,
  getPaymentConfigController,
  testWompiConnectionController,
  generateIntegritySignatureController,
  createWompiTransactionController,
  validateWompiDataController,
  getTransactionStatusController,
  updatePaymentStatusController,
  getPaymentFromDatabaseController,
} from "../controllers/payments";

export const paymentsRoutes = () =>
  Router()
    .get("/acceptance-tokens", getAcceptanceTokensController)
    .get("/config", getPaymentConfigController)
    .get("/test-connection", testWompiConnectionController)
    .get("/transaction/:transactionId", getTransactionStatusController)
    .get("/payment/db/:transactionId", getPaymentFromDatabaseController)
    .post("/generate-signature", generateIntegritySignatureController)
    .post("/create-transaction", createWompiTransactionController)
    .post("/validate-data", validateWompiDataController)
    .put("/payment/:transactionId/status", updatePaymentStatusController);
