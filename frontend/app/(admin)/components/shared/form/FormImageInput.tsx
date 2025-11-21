import { forwardRef, Ref } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { ImageDropzone } from "@/app/(admin)/components/shared/ImageDropzone";

type FormImageInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  previewImage?: string;
};

const FormImageInput = forwardRef(function FormImageInputRender<
  TFormData extends FieldValues
>(
  { control, name, label, previewImage }: FormImageInputProps<TFormData>,
  ref: Ref<HTMLDivElement>
) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-md font-medium text-foreground/90 leading-snug">
            {label}
          </FormLabel>

          <div className="space-y-2 mt-2">
            <FormControl className="">
              <ImageDropzone

                ref={ref}
                previewImage={previewImage}
                onFileAccepted={(file) => field.onChange(file)}
                onFileRemoved={() => field.onChange(null)}
              />
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}) as <TFormData extends FieldValues>(
  props: FormImageInputProps<TFormData> & { ref?: Ref<HTMLDivElement> }
) => React.ReactElement;

export default FormImageInput;
