"use client";

import { useState, useEffect, useTransition, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

import { FormTextInput } from "@/app/(admin)/components/shared/form";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { customerFormSchema, CustomerFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { CustomerServerActionResponse } from "@/app/(admin)/types/server-action";

type BaseCustomerFormProps = {
  title: string;
  description: string;
  submitButtonText: string;
  actionVerb: string;
  children: ReactNode;
  action: (formData: FormData) => Promise<CustomerServerActionResponse>;
};

type AddCustomerFormProps = BaseCustomerFormProps & {
  initialData?: never;
};

type EditCustomerFormProps = BaseCustomerFormProps & {
  initialData: Partial<CustomerFormData>;
};

type CustomerFormProps = AddCustomerFormProps | EditCustomerFormProps;

export default function CustomerFormSheet({
  title,
  description,
  submitButtonText,
  actionVerb,
  initialData,
  children,
  action,
}: CustomerFormProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      ...initialData,
    },
  });

  useEffect(() => {
    form.reset(initialData);
  }, [form, initialData]);

  const onSubmit = (data: CustomerFormData) => {
    const formData = objectToFormData(data);

    startTransition(async () => {
      const result = await action(formData);

      if ("validationErrors" in result) {
        Object.keys(result.validationErrors).forEach((key) => {
          form.setError(key as keyof CustomerFormData, {
            message: result.validationErrors![key],
          });
        });
      } else if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        form.reset();
        toast.success(
          `Customer "${result.customer.name}" ${actionVerb} successfully!`,
          { position: "top-center" }
        );
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setIsSheetOpen(false);
      }
    });
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[700px] p-0! gap-0! overflow-hidden border-2 border-l-slate-400/40 border-b-0 border-t-0 b-r-0 rounded-bl-2xl rounded-tl-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-900 shadow-2xl shadow-indigo-500/20">
        <div className="h-screen w-full m-0 p-0 flex flex-col bg-linear-to-br from-slate-900/95 via-slate-800/90 to-slate-700/85 backdrop-blur-xl">
          {/* Header mejorado con gradiente premium */}
          <div className="relative px-8 py-6 bg-linear-to-r from-slate-950/90 via-slate-800/70 to-slate-950/90 border-none">
            <div className="absolute inset-0 bg-[url('/imgs/grid.svg')] opacity-5" />
            <div className="relative space-y-1">
              <SheetTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                {title}
              </SheetTitle>
              <p className="text-sm text-slate-400 font-medium">{description}</p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-[calc(100vh-7rem)]"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-4 bg-linear-to-b from-slate-950/50 via-slate-900/30 to-slate-800/20">
                <div className="space-y-4 max-w-5xl mx-auto">
                  {/* Sección: Información del Cliente */}
                  <div className="group relative space-y-4 p-7 rounded-2xl border-border/40 bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 border-none">
                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20">
                        <div className="size-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Información del Cliente
                      </h3>
                    </div>

                    <div className="relative space-y-4">
                      <FormTextInput
                        control={form.control}
                        name="name"
                        label="Nombre Completo"
                        placeholder="Ingresa el nombre completo del cliente"
                      />

                      <FormTextInput
                        control={form.control}
                        name="email"
                        label="Correo Electrónico"
                        placeholder="ejemplo@correo.com"
                      />

                      <FormTextInput
                        control={form.control}
                        name="phone"
                        label="Teléfono"
                        placeholder="3001234567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer premium con animación */}
              <div className="px-8 py-5 border-t-2 border-indigo-400/40 bg-linear-to-t from-slate-950/95 via-slate-900/90 to-slate-800/85 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20">
                <div className="max-w-5xl mx-auto">
                  <FormSubmitButton
                    isPending={isPending}
                    className="w-full h-14 text-base font-bold tracking-wide bg-linear-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-xl hover:shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl border border-primary/20"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="size-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span className="animate-pulse">Procesando tu solicitud...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {submitButtonText}
                        <svg
                          className="size-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </FormSubmitButton>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
