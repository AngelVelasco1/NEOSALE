export interface InputField {
  name: string;
  label: string;
  placeholder: string;
  inputType: "text" | "email" | "password" | "tel" | "number";
  autoComplete?: string;
}
