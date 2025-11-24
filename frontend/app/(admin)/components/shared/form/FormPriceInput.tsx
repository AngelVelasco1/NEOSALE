import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormPriceInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder: string;
};

function FormPriceInput<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormPriceInputProps<TFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-md font-medium text-foreground/90 ">
            {label}
          </FormLabel>

          <div className="space-y-2 w-full">
            <FormControl>
              <div className="relative">
                <div className="absolute top-0 left-0 border-r border-slate-600/40 bg-slate-700/30 px-3 h-12 w-10 grid place-items-center text-lg rounded-l-xl text-slate-300">
                  <span>$</span>
                </div>

                <Input
                  type="number"
                  className="h-12 pl-12 pr-4 mt-2 rounded-xl border-2 border-slate-600/40 bg-slate-800/50 text-slate-200 placeholder:text-slate-400/70 focus:border-indigo-400/60 focus:bg-slate-700/50 hover:border-slate-500/60 transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm"
                  onFocus={(e) => e.target.select()}
                  placeholder={placeholder}
                  {...field}
                />
              </div>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormPriceInput;
