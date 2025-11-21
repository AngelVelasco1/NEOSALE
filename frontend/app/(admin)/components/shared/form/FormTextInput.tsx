import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormTextInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
};

function FormTextInput<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  readOnly,
}: FormTextInputProps<TFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-md font-medium text-foreground/90 ">
            {label}
          </FormLabel>

          <div className="space-y-2">
            <FormControl>
              <Input
                className={`h-12 px-4 mt-2 rounded-xl border-2 text-slate-200 placeholder:text-slate-400/70 focus:ring-0 focus:ring-offset-0 shadow-sm transition-all duration-200 ${readOnly
                    ? "border-slate-500/30 bg-slate-700/30 text-slate-300 cursor-not-allowed"
                    : "border-slate-600/40 bg-slate-800/50 focus:border-indigo-400/60 focus:bg-slate-700/50 hover:border-slate-500/60"
                  }`}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                onFocus={
                  type === "number" && !readOnly ? (e) => e.target.select() : undefined
                }
                {...field}
              />
            </FormControl>

            <FormMessage className="text-red-400 text-sm" />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormTextInput;
