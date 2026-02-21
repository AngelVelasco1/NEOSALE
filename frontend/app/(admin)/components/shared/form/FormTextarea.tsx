import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type FormTextareaProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder: string;
};

function FormTextarea<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormTextareaProps<TFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-md font-medium text-foreground/90">
            {label}
          </FormLabel>

          <div className="space-y-2">
            <FormControl>
              <Textarea className="h-32 max-h-36 mt-2 border-2 border-slate-600/40 bg-slate-800/50 text-slate-200 placeholder:text-slate-400/70 focus:border-indigo-400/60 focus:bg-slate-700/50 hover:border-slate-500/60 transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm" placeholder={placeholder} {...field} />
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormTextarea;
