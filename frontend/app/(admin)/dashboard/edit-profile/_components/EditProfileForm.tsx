"use client";

import { useTransition, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User2Icon,
  Mail,
  Settings,
  Edit2,
  Shield,
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FormImageInput } from "@/app/(admin)/components/shared/form";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { motion, AnimatePresence } from "framer-motion";

import { profileFormSchema, ProfileFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { SBStaff } from "@/app/(admin)/services/staff/types";
import { editProfile } from "@/app/(admin)/actions/profile/editProfile";

type Section = 'info' | 'edit' | 'security';

export default function EditProfileForm({ profile }: { profile: SBStaff }) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const imageDropzoneRef = useRef<HTMLDivElement>(null);
  const { reFetchUserProfile } = useUserSafe();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('info');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange", // Validación en tiempo real
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? "",
      image: profile.image ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const formData = objectToFormData(data);

    startTransition(async () => {
      const result = await editProfile(String(profile.id), formData);

      if ("validationErrors" in result) {
        Object.keys(result.validationErrors).forEach((key) => {
          form.setError(key as keyof ProfileFormData, {
            message: result.validationErrors![key],
          });
        });
      } else if ("dbError" in result) {
        toast.error(result.dbError, {
          position: "top-center",
        });
      } else {
        toast.success("Perfil actualizado correctamente", {
          position: "top-center",
          description: "Tus cambios han sido guardados.",
        });
        // Refrescar el perfil del usuario en el contexto
        await reFetchUserProfile();
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setActiveSection('info');
      }
    });
  };

  const onInvalid = (errors: FieldErrors<ProfileFormData>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, {
        position: "top-center",
      });
    }

    if (errors.image) {
      imageDropzoneRef.current?.focus();
    }
  };

  // Funciones de validación en tiempo real para la contraseña
  const validatePasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    return { checks, strength: passedChecks };
  };

  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");
  const passwordValidation = newPassword
    ? validatePasswordStrength(newPassword)
    : null;

  const profileData = [
    {
      icon: User,
      label: "Nombre",
      value: profile.name,
      color: "text-blue-400",
    },
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      color: "text-indigo-400",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: profile.phone || "No especificado",
      color: "text-cyan-400",
    },
    {
      icon: Shield,
      label: "Rol",
      value: "Administrador",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="max-w-7xl m-auto ">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Sidebar */}
        <motion.div
          className="lg:col-span-3 min-h-screen"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="sticky top-10 border border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-800/98 backdrop-blur-2xl overflow-hidden">
            <CardContent className="p-5 space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-slate-700/50">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative w-32 h-32 rounded-full border-4 border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden shadow-xl">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User2Icon className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full border-4 border-slate-900 shadow-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">{profile.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30 rounded-full">
                    Administrador
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <motion.button
                  onClick={() => setActiveSection('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    activeSection === 'info'
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Mi Perfil</span>
                </motion.button>

                <motion.button
                  onClick={() => setActiveSection('edit')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    activeSection === 'edit'
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit2 className="w-5 h-5" />
                  <span className="font-semibold">Editar Perfil</span>
                </motion.button>

                <motion.button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    activeSection === 'security'
                      ? "bg-gradient-to-r from-purple-600/20 to-blue-700/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-semibold">Seguridad</span>
                </motion.button>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="lg:col-span-9"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-800/98 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            
            <CardContent className="p-8 relative z-10">
              {/* Info Section */}
              <AnimatePresence mode="wait">
                {activeSection === 'info' && (
                  <motion.div
                    key="info"
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                          Información del Perfil
                        </h2>
                        <p className="text-slate-400 mt-1">Detalles de tu cuenta de administrador</p>
                      </div>
          
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileData.map((item, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-slate-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-start gap-4 p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:border-blue-500/30">
                            <div className={`p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-blue-500/30 transition-all duration-300`}>
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                {item.label}
                              </p>
                              <p className="text-base font-semibold text-slate-200 truncate">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

               
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Edit Section */}
              <AnimatePresence mode="wait">
                {activeSection === 'edit' && (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-8 pb-4 border-b border-slate-700/50">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 bg-clip-text text-transparent">
                        Editar Información
                      </h2>
                      <p className="text-slate-400 mt-1">Actualiza los detalles de tu perfil</p>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="relative">
                          <div className="relative max-w-fit flex flex-col items-center space-y-4 p-6 mx-auto rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                            <div className="text-center space-y-2">
                              <h3 className="text-sm font-medium text-slate-300">
                                Imagen de Perfil
                              </h3>
                            </div>
                            <FormImageInput
                              control={form.control}
                              name="image"
                              label=""
                              previewImage={profile.image ?? undefined}
                              ref={imageDropzoneRef}
                            />
                          </div>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                            <h3 className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
                              Información Personal
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                <User className="w-4 h-4 text-blue-400" />
                                Nombre Completo
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("name")}
                                  type="text"
                                  placeholder="Ingrese su nombre"
                                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    form.formState.errors.name
                                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                      : form.formState.touchedFields.name && !form.formState.errors.name
                                      ? "border-green-500/50 focus:ring-green-500/20 focus:border-green-500"
                                      : "border-slate-700/50 focus:ring-blue-500/20 focus:border-blue-500"
                                  }`}
                                />
                                {form.formState.touchedFields.name && !form.formState.errors.name && (
                                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                )}
                                {form.formState.errors.name && (
                                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                              </div>
                              {form.formState.errors.name && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.name.message}
                                </p>
                              )}
                            </div>

                            {/* Phone */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                <Phone className="w-4 h-4 text-blue-400" />
                                Teléfono
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("phone")}
                                  type="tel"
                                  placeholder="+1234567890"
                                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    form.formState.errors.phone
                                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                      : form.formState.touchedFields.phone && !form.formState.errors.phone && form.watch("phone")
                                      ? "border-green-500/50 focus:ring-green-500/20 focus:border-green-500"
                                      : "border-slate-700/50 focus:ring-blue-500/20 focus:border-blue-500"
                                  }`}
                                />
                                {form.formState.touchedFields.phone && !form.formState.errors.phone && form.watch("phone") && (
                                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                )}
                                {form.formState.errors.phone && (
                                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                              </div>
                              {form.formState.errors.phone && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Email (readonly) */}
                          <div className="relative">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                              <Mail className="w-4 h-4 text-blue-400" />
                              Correo Electrónico
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={profile.email}
                                readOnly
                                className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-lg text-slate-400 cursor-not-allowed"
                              />
                              <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-slate-800 to-slate-800/80 text-slate-300 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                                  <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse shadow-sm shadow-blue-500/50" />
                                  Verificado
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
                          <motion.button
                            type="button"
                            onClick={() => setActiveSection('info')}
                            className="px-6 py-3 border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 rounded-lg font-semibold"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancelar
                          </motion.button>
                          <motion.button
                            type="submit"
                            disabled={isPending}
                            className="relative px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative flex items-center gap-2">
                              {isPending ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Guardando...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>Guardar Cambios</span>
                                </>
                              )}
                            </span>
                          </motion.button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Section */}
              <AnimatePresence mode="wait">
                {activeSection === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-8 pb-4 border-b border-slate-700/50">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-slate-400 bg-clip-text text-transparent">
                        Seguridad y Contraseña
                      </h2>
                      <p className="text-slate-400 mt-1">Mantén tu cuenta segura actualizando tu contraseña</p>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                        <div className="p-6 rounded-xl border border-slate-600/40 bg-gradient-to-br from-slate-900/30 to-slate-800/20 space-y-5">
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-400">
                              <p className="font-medium text-slate-300 mb-1">Cambiar Contraseña</p>
                              <p>Deja estos campos vacíos si no deseas cambiar tu contraseña.</p>
                            </div>
                          </div>

                          <div className="space-y-5">
                            {/* Current Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Contraseña Actual
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("currentPassword")}
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Ingrese contraseña actual"
                                  className={`w-full px-4 py-3 pr-12 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    form.formState.errors.currentPassword
                                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                      : "border-slate-700/50 focus:ring-purple-500/20 focus:border-purple-500"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {form.formState.errors.currentPassword && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.currentPassword.message}
                                </p>
                              )}
                            </div>

                            {/* New Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Nueva Contraseña
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("newPassword")}
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Ingrese nueva contraseña"
                                  className={`w-full px-4 py-3 pr-12 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    form.formState.errors.newPassword
                                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                      : newPassword && passwordValidation?.strength === 5
                                      ? "border-green-500/50 focus:ring-green-500/20 focus:border-green-500"
                                      : "border-slate-700/50 focus:ring-purple-500/20 focus:border-purple-500"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>

                              {/* Password Strength Indicator */}
                              {newPassword && passwordValidation && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-300 ${
                                          passwordValidation.strength === 5
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 w-full"
                                            : passwordValidation.strength >= 3
                                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 w-3/5"
                                            : "bg-gradient-to-r from-red-500 to-orange-500 w-2/5"
                                        }`}
                                      />
                                    </div>
                                    <span
                                      className={`text-xs font-medium ${
                                        passwordValidation.strength === 5
                                          ? "text-green-400"
                                          : passwordValidation.strength >= 3
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {passwordValidation.strength === 5 ? "Fuerte" : passwordValidation.strength >= 3 ? "Media" : "Débil"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className={`flex items-center gap-1.5 ${passwordValidation.checks.length ? "text-green-400" : "text-slate-500"}`}>
                                      {passwordValidation.checks.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>8+ caracteres</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordValidation.checks.uppercase ? "text-green-400" : "text-slate-500"}`}>
                                      {passwordValidation.checks.uppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Mayúscula</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordValidation.checks.lowercase ? "text-green-400" : "text-slate-500"}`}>
                                      {passwordValidation.checks.lowercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Minúscula</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordValidation.checks.number ? "text-green-400" : "text-slate-500"}`}>
                                      {passwordValidation.checks.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Número</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordValidation.checks.special ? "text-green-400" : "text-slate-500"}`}>
                                      {passwordValidation.checks.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Carácter especial</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {form.formState.errors.newPassword && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.newPassword.message}
                                </p>
                              )}
                            </div>

                            {/* Confirm Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Confirmar Nueva Contraseña
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("confirmPassword")}
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirmar nueva contraseña"
                                  className={`w-full px-4 py-3 pr-12 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    form.formState.errors.confirmPassword
                                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                      : confirmPassword && newPassword && confirmPassword === newPassword
                                      ? "border-green-500/50 focus:ring-green-500/20 focus:border-green-500"
                                      : "border-slate-700/50 focus:ring-purple-500/20 focus:border-purple-500"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {confirmPassword && newPassword && confirmPassword === newPassword && (
                                  <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                )}
                              </div>
                              {form.formState.errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.confirmPassword.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
                          <motion.button
                            type="button"
                            onClick={() => setActiveSection('info')}
                            className="px-6 py-3 border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 rounded-lg font-semibold"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancelar
                          </motion.button>
                          <motion.button
                            type="submit"
                            disabled={isPending}
                            className="relative px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-500 hover:via-blue-500 hover:to-purple-600 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative flex items-center gap-2">
                              {isPending ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Actualizando...</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  <span>Actualizar Contraseña</span>
                                </>
                              )}
                            </span>
                          </motion.button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
