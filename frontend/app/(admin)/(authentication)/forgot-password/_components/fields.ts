import { InputField } from "@/types/auth-input";

interface PasswordResetField extends InputField {
  name: "email";
}

export const passwordResetFields: PasswordResetField[] = [
  {
    name: "email",
    label: "Correo registrado",
    placeholder: "cliente@neosale.com",
    inputType: "email",
    autoComplete: "email",
  },
];
