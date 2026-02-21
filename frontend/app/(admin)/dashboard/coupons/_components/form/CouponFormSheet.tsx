"use client";

import { useState, useTransition, useEffect, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import {
  FormTextInput,
  FormDatetimeInput,
  FormDiscountInput,
  FormNumberInput,
} from "@/app/(admin)/components/shared/form";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { couponFormSchema, CouponFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { CouponServerActionResponse } from "@/app/(admin)/types/server-action";

type BaseCouponFormProps = {
  title: string;
  description: string;
  submitButtonText: string;
  actionVerb: string;
  children: ReactNode;
  action: (formData: FormData) => Promise<CouponServerActionResponse>;
};

type AddCouponFormProps = BaseCouponFormProps & {
  initialData?: never;
};

type EditCouponFormProps = BaseCouponFormProps & {
  initialData: Partial<CouponFormData>;
};

type CouponFormProps = AddCouponFormProps | EditCouponFormProps;

export default function CouponFormSheet({
  title,
  description,
  submitButtonText,
  actionVerb,
  initialData,
  children,
  action,
}: CouponFormProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      name: "",
      code: "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
      isPercentageDiscount: true,
      discountValue: 10,
      minPurchaseAmount: undefined,
      usageLimit: undefined,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  const onSubmit = (data: CouponFormData) => {
    const formData = objectToFormData(data);

    startTransition(async () => {
      const result = await action(formData);

      if ("validationErrors" in result) {
        Object.keys(result.validationErrors).forEach((key) => {
          form.setError(key as keyof CouponFormData, {
            message: result.validationErrors![key],
          });
        });

        form.setFocus(
          Object.keys(result.validationErrors)[0] as keyof CouponFormData
        );
      } else if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        form.reset();
        toast.success(
          `Coupon "${result.coupon.name}" ${actionVerb} successfully!`,
          { position: "top-center" }
        );
        queryClient.invalidateQueries({ queryKey: ["coupons"] });
        setIsSheetOpen(false);
      }
    });
  };

  const onInvalid = (errors: FieldErrors<CouponFormData>) => {
    
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {children}

      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[700px] p-0! gap-0! overflow-hidden border-2 border-l-slate-400/40 border-b-0 border-t-0 b-r-0 rounded-bl-2xl rounded-tl-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-900 shadow-2xl shadow-indigo-500/20">
        <div className="h-screen w-full m-0 p-0 flex flex-col bg-linear-to-br from-slate-900/95 via-slate-800/90 to-slate-700/85 backdrop-blur-xl">
          {/* Header Premium */}
          <div className="relative px-8 py-6 bg-linear-to-r from-slate-950/90 via-slate-800/70 to-slate-950/90 border-none">
            <div className="absolute inset-0 bg-[url('/imgs/grid.svg')] opacity-5" />
            <div className="relative space-y-1">
              <SheetTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                {title}
              </SheetTitle>
              <SheetDescription className="text-slate-400 text-sm">
                {description}
              </SheetDescription>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col h-[calc(100vh-7rem)]"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-4 bg-linear-to-b from-slate-950/50 via-slate-900/30 to-slate-800/20">
                <div
                  className="space-y-4 max-w-5xl mx-auto"
                  ref={setContainer}
                >
                  {/* Sección: Información Básica */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-blue-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20">
                        <div className="size-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Información del Cupón
                      </h3>
                    </div>

                    <div className="relative space-y-4">
                      <FormTextInput
                        control={form.control}
                        name="name"
                        label="Nombre del Cupón"
                        placeholder="Ej: Black Friday Sale"
                      />

                      <FormTextInput
                        control={form.control}
                        name="code"
                        label="Código del Cupón"
                        placeholder="Ej: BLACKFRIDAY2024"
                      />
                    </div>
                  </div>

                  {/* Sección: Descuento */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-green-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/10 border border-green-500/20">
                        <div className="size-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Valor del Descuento
                      </h3>
                    </div>

                    <div className="relative space-y-4">
                      <FormDiscountInput
                        control={form.control}
                        name="discountValue"
                        label="Descuento"
                        placeholder="10"
                        isPercentageField="isPercentageDiscount"
                        form={form}
                      />

                      <FormNumberInput
                        control={form.control}
                        name="minPurchaseAmount"
                        label="Monto Mínimo de Compra (Opcional)"
                        placeholder="Dejar vacío para sin mínimo"
                      />
                    </div>
                  </div>

                  {/* Sección: Límites y Expiración */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/20">
                        <div className="size-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Disponibilidad
                      </h3>
                    </div>

                    <div className="relative space-y-4">
                      <FormNumberInput
                        control={form.control}
                        name="usageLimit"
                        label="Límite de Uso (Opcional)"
                        placeholder="Dejar vacío para uso ilimitado"
                      />

                      <FormDatetimeInput
                        control={form.control}
                        name="expiresAt"
                        label="Fecha de Expiración"
                        container={container || undefined}
                      />

                      {/* Info Card */}
                      <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">
                            <svg className="size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold text-blue-300">
                              💡 Consejo
                            </p>
                            <p className="text-sm text-blue-200/80">
                              El cupón se activará inmediatamente al crearse. Puedes desactivarlo temporalmente usando el switch en la tabla, o eliminarlo permanentemente con el botón de eliminar.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Premium */}
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
