import { useCallback } from "react";
import { useUser } from "@/app/(auth)/context/UserContext";
import * as addressApi from "../addressesApi";
import {
    Address,
    CreateAddressData,
} from "../addressesApi";
import { createAddressApi } from "../addressesApi";

export const useAddresses = () => {
    const { userProfile } = useUser();
    const userId = userProfile?.id;

    const getUserAddresses = useCallback(async () => {
        if (!userId) throw new Error("Usuario no autenticado");
        return addressApi.getUserAddresses(userId);
    }, [userId]);

    const getAddressById = useCallback(
        async (address_id: number) => {
            if (!userId) throw new Error("Usuario no autenticado");
            return addressApi.getAddressById(address_id, userId);
        },
        [userId]
    );

    const getDefaultAddress = useCallback(async () => {
        if (!userId) throw new Error("Usuario no autenticado");
        return addressApi.getDefaultAddress(userId);
    }, [userId]);

    const createAddress = useCallback(
        async (addressData: CreateAddressData): Promise<Address> => {
            if (!userId) {
                throw new Error("Usuario no autenticado");
            }

            try {
                const result = await createAddressApi(addressData, userId);

                if (!result.success || !result.data) {
                    throw new Error(result.error || "Error al crear la dirección");
                }

                // ✅ Retornar la dirección completa del servidor
                return result.data;
            } catch (error) {
                console.error("Error creating address:", error);
                throw error;
            }
        },
        [userId]
    );

    const updateAddress = useCallback(
        async (address_id: number, updateData: addressApi.UpdateAddressData) => {
            if (!userId) throw new Error("Usuario no autenticado");
            return addressApi.updateAddress(address_id, updateData, userId);
        },
        [userId]
    );

    const deleteAddress = useCallback(
        async (address_id: number) => {
            if (!userId) throw new Error("Usuario no autenticado");
            return addressApi.deleteAddress(address_id, userId);
        },
        [userId]
    );

    const setDefaultAddress = useCallback(
        async (address_id: number) => {
            if (!userId) throw new Error("Usuario no autenticado");
            return addressApi.setDefaultAddress(address_id, userId);
        },
        [userId]
    );

    return {
        getUserAddresses,
        getAddressById,
        getDefaultAddress,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        userId,
        isAuthenticated: !!userId,
    };
};
