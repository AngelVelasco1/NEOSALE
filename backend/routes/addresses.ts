import { Router } from 'express';
import { getUserAddresses, getAddressById, getDefaultAddress, setDefaultAddress, createAddress, updateAddress, deleteAddress } from '../controllers/addresses';

export const addressesRoutes = () => {
    const app = Router();
    app.get("/getUserAddresses", getUserAddresses);
    app.get("/getAddress/:address_id", getAddressById);
    app.get("/getDefaultAddress", getDefaultAddress);
    app.post("/setDefaultAddress/:address_id", setDefaultAddress);
    app.post("/createAddress", createAddress);
    app.put("/updateAddress/:address_id", updateAddress);
    app.delete("/deleteAddress/:address_id", deleteAddress);
    return app;
}