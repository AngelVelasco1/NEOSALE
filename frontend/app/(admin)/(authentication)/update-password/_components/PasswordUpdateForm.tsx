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
} from "@/components/ui/form";
import Typography from "@/app/(admin)/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { passwordUpdateFields } from "./fields";
import { passwordUpdateFormSchema } from "./schema";

type FormData = z.infer<typeof passwordUpdateFormSchema>;

type PasswordUpdateFormProps = {
  token: string;
};

export default function PasswordUpdateForm({ token }: PasswordUpdateFormProps) {
  const router = useRouter();

  const securityNotes = [
    "Comprobamos el token y tu correo antes de aceptar el cambio.",
    "Al actualizar, invalidamos cualquier enlace anterior.",
    "Recibirás una notificación si detectamos actividad inusual.",
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axios.post("/auth/update-password", {
        ...formData,
        token,
      });
    },
    onSuccess: () => {
      toast.success("¡Contraseña actualizada!", {
        description: "Inicia sesión con tu nueva clave.",
        position: "top-center",
      });

      form.reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const { errors } = error.response?.data || {};

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
      router.push("/login");
    }
  }, [isSuccess, router]);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-900/40 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-900/60">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-6 -bottom-16 h-48 w-48 rounded-full bg-indigo-600/25 blur-3xl" />

      <div className="relative space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Restablecimiento verificado
          </p>
          <Typography variant="h2" className="text-2xl text-white">
            Define tu nueva contraseña
          </Typography>
          <p className="text-sm text-slate-300">
            Utiliza una clave única para proteger tus datos y confirma los campos para asegurar que no haya errores.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {passwordUpdateFields.map((formField) => (
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

            <Button
              disabled={isPending}
              type="submit"
              className="w-full rounded-2xl bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-slate-900/40 hover:shadow-xl"
              size="lg"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? "Guardando cambios..." : "Actualizar contraseña"}
            </Button>
          </form>
        </Form>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
            Seguridad
          </p>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {securityNotes.map((note) => (
              <li key={note} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
