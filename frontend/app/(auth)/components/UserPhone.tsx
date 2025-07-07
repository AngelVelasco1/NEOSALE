"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserById } from "../services/api"; // Adjust the import path as necessary
export const UserPhone = () => {
  const { data: session } = useSession();
  
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
        getUserById(Number(session.user.id))
            .then((user) => {
            if (user && user.phonenumber) {
                setPhone(user.phonenumber);
            } else {
                setPhone("No especificado");
            }
            })
            .catch((error) => {
            console.error(error.message);
            setPhone("Error al cargar teléfono");
      });
    }
  }, [session]);

  return <div>{phone ? `Teléfono: ${phone}` : "Cargando teléfono..."}</div>;
};

export default UserPhone;