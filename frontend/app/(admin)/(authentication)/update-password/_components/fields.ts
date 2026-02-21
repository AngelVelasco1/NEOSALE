import { InputField } from "@/types/auth-input";

interface PasswordUpdateField extends InputField {
  name: "password" | "confirmPassword";
}

export const passwordUpdateFields: PasswordUpdateField[] = [
  {
    name: "password",
    label: "Nueva contraseña",
    placeholder: "Ingresa tu nueva clave",
    inputType: "password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirma tu contraseña",
    placeholder: "Repite la nueva clave",
    inputType: "password",
    autoComplete: "new-password",
  },
];
