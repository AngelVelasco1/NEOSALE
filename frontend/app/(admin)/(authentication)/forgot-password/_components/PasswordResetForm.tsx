"use client";

import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/components/ui/form";
import Typography from "@/app/(admin)/components/ui/typography";
import { Input } from "@/app/(admin)/components/ui/input";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { passwordResetFields } from "./fields";
import { passwordResetFormSchema } from "./schema";

type FormData = z.infer<typeof passwordResetFormSchema>;

const parsedExpiration = Number(process.env.NEXT_PUBLIC_RESET_TOKEN_EXPIRATION_MINUTES || "15");
const RESET_TOKEN_EXPIRATION_MINUTES = Number.isFinite(parsedExpiration) && parsedExpiration > 0 ? parsedExpiration : 15;

const assuranceNotes = [
  "Validamos que la cuenta exista antes de generar el enlace.",
  "El token se cifra con SHA-256 y se elimina tras usarse.",
  `Tienes ${RESET_TOKEN_EXPIRATION_MINUTES} minutos para completar el proceso antes de solicitar uno nuevo.`,
];

export default function PasswordResetForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post<{ exists: boolean }>(
        "/api/auth/check-verification",
        {
          email: formData.email,
        }
      );

      if (!data.exists) {
        const validationError = new Error("EMAIL_NOT_FOUND");
        (validationError as Error & { fieldErrors?: Record<string, string> }).fieldErrors = {
          email: "No encontramos una cuenta asociada a este correo.",
        };
        throw validationError;
      }

      await axios.post("/auth/forgot-password", formData);
    },
    onSuccess: () => {
      toast.success("Enlace enviado", {
        description:
          "Revisa tu bandeja principal o spam y sigue las instrucciones antes de que el enlace expire.",
        position: "top-center",
        duration: 7000,
      });

      form.reset();
    },
    onError: (error) => {
      if ((error as Error & { fieldErrors?: Record<string, string> }).fieldErrors) {
        const fieldErrors = (error as Error & { fieldErrors?: Record<string, string> }).fieldErrors;
        for (const key in fieldErrors) {
          form.setError(key as keyof FormData, {
            message: fieldErrors[key] ?? "",
          });
        }
        return;
      }

      if (axios.isAxiosError(error)) {
        const { errors } = error.response?.data;

        for (const key in errors) {
          if (errors[key]) {
            form.setError(key as keyof FormData, {
              message: errors[key],
            });
          }
        }
      } else {
        console.error(error);
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 1200);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isSuccess, router]);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-900/40 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-900/60">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-6 -bottom-16 h-48 w-48 rounded-full bg-indigo-600/25 blur-3xl" />

      <div className="relative space-y-6">
        <div className="space-y-3">
       
          <Typography variant="h2" className="text-2xl text-white">
            Restablece tu contraseña
          </Typography>
          <p className="text-sm text-slate-300">
            Ingresa el correo asociado a tu cuenta NeoSale. Si coincide con un usuario activo,
            generaremos un enlace para que definas una nueva clave.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {passwordResetFields.map((formField) => (
              <FormField
                key={`form-field-${formField.name}`}
                control={form.control}
                name={formField.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-100">
                      {formField.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={formField.inputType}
                        placeholder={formField.placeholder}
                        autoComplete={formField.autoComplete}
                        className="h-12 rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-300 text-xs" />
                  </FormItem>
                )}
              />
            ))}

            <FormSubmitButton
              isPending={isPending}
              className="w-full rounded-2xl bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-slate-900/40 hover:shadow-xl"
            >
              {isPending ? "Enviando enlace..." : "Enviar enlace seguro"}
            </FormSubmitButton>
          </form>
        </Form>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
            Lo que debes saber
          </p>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {assuranceNotes.map((note) => (
              <li key={note} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            ¿Necesitas ayuda? seguridad@neosale.com
          </span>
          <Typography variant="a" href="/register" className="text-sky-300 hover:text-sky-200">
            ¿Aún no tienes cuenta? Regístrate
          </Typography>
        </div>
      </div>
    </div>
  );
}
