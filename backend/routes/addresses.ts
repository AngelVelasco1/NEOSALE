import { Router } from "express";
import {
  getUserAddresses,
  getAddressById,
  getDefaultAddress,
  setDefaultAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addresses";

export const addressesRoutes = () =>
  Router()
    .get("/getUserAddresses", getUserAddresses)
    .get("/getAddress/:address_id", getAddressById)
    .get("/getDefaultAddress", getDefaultAddress)
    .post("/setDefaultAddress/:address_id", setDefaultAddress)
    .post("/createAddress", createAddress)
    .put("/updateAddress/:address_id", updateAddress)
    .delete("/deleteAddress/:address_id", deleteAddress);
