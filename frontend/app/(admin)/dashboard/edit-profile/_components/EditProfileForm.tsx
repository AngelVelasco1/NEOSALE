"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
  Save,
  ChevronRight,
  Loader2,
  Calendar,
  Zap,
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
import { StaffProfile } from "@/app/(admin)/services/staff/types";
import { editProfile } from "@/app/(admin)/actions/profile/editProfile";
import { fetchStaffDetails } from "@/app/(admin)/services/staff";


type Section = 'general' | 'personal' | 'security';

const navigationItems = [
  { id: 'general', label: 'General', icon: User, description: 'Información de perfil' },
  { id: 'personal', label: 'Personal', icon: Edit2, description: 'Datos personales' },
  { id: 'security', label: 'Seguridad', icon: Lock, description: 'Cambiar contraseña' },
];

export default function EditProfileForm() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const imageDropzoneRef = useRef<HTMLDivElement>(null);
  const { reFetchUserProfile } = useUserSafe();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('general');

  // Fetch profile client-side
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const data = await fetchStaffDetails(parseInt(session.user.id));
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Error al cargar el perfil");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadProfile();
  }, [session?.user?.id]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      image: profile?.image ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phone: profile.phone ?? "",
        image: profile.image ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, form]);

  // Show loading state
  if (isLoadingProfile || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        await reFetchUserProfile();
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setActiveSection('general');
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

  const profileStats = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Shield,
      label: "Rol",
      value: "Administrador",
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-blue-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: profile.phone || "No especificado",
      color: "text-cyan-400",
      bgColor: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-500/30"
    },
    {
      icon: Calendar,
      label: "Miembro desde",
      value: new Date().toLocaleDateString('es-CO'),
      color: "text-green-400",
      bgColor: "from-green-500/20 to-emerald-500/10",
      borderColor: "border-green-500/30"
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-800 min-h-screen sticky top-0">
          <div className="p-6 space-y-8">
            {/* Profile Header */}
            <div className="space-y-4 pb-6 border-b border-slate-800">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-28 h-28 rounded-full border-3 border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden shadow-xl mx-auto">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User2Icon className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-xs text-slate-400">{profile.email}</p>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-linear-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30 rounded-full">
                  ⚙️ Administrador
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? "bg-linear-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-400' : ''}`} />
                      <div className="text-left">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-8 space-y-8">
            {/* General Section */}
            <AnimatePresence mode="wait">
              {activeSection === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-blue-200 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
                      Mi Perfil
                    </h2>
                    <p className="text-slate-400 mt-2">Visualiza los detalles de tu cuenta de administrador</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {profileStats.map((stat, idx) => {
                      const StatIcon = stat.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                          whileHover={{ scale: 1.02 }}
                          className={`relative rounded-2xl p-6 border-2 ${stat.borderColor} bg-linear-to-br ${stat.bgColor} backdrop-blur-xl overflow-hidden group`}
                        >
                          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                              <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:border-blue-500/30 transition-all`}>
                                <StatIcon className={`w-5 h-5 ${stat.color}`} />
                              </div>
                              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-blue-400 to-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                              <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Profile Info Card */}
                  <div className="relative rounded-3xl border-2 border-blue-500/25 bg-linear-to-br from-slate-950 via-blue-950/20 to-slate-950 p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Estado de tu Cuenta</h3>
                          <p className="text-slate-400 text-sm">Toda tu información está segura y actualizada</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-medium text-slate-400">Email</span>
                          </div>
                          <p className="text-sm font-semibold text-white">Verificado</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-blue-500/30 space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium text-slate-400">Permisos</span>
                          </div>
                          <p className="text-sm font-semibold text-white">Completos</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-purple-500/30 space-y-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-medium text-slate-400">Estado</span>
                          </div>
                          <p className="text-sm font-semibold text-white">Activo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Personal Section */}
            <AnimatePresence mode="wait">
              {activeSection === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-blue-200 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
                      Editar Perfil Personal
                    </h2>
                    <p className="text-slate-400 mt-2">Actualiza tu información personal</p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                      {/* Profile Picture Card */}
                      <div className="relative rounded-3xl border-2 border-blue-500/25 bg-linear-to-br from-slate-950 via-blue-950/20 to-slate-950 p-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                              <User2Icon className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">Foto de Perfil</h3>
                              <p className="text-slate-400 text-sm">Sube una nueva foto o cambia la actual</p>
                            </div>
                          </div>

                          <div className="flex justify-center p-6 rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all">
                            <FormImageInput
                              control={form.control}
                              name="image"
                              label=""
                              previewImage={profile.image ?? undefined}
                              ref={imageDropzoneRef}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Personal Information Card */}
                      <div className="relative rounded-3xl border-2 border-blue-500/25 bg-linear-to-br from-slate-950 via-blue-950/20 to-slate-950 p-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                              <Edit2 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">Información Personal</h3>
                              <p className="text-slate-400 text-sm">Mantén tus datos actualizados</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <User className="w-4 h-4 text-blue-400" />
                                Nombre Completo
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("name")}
                                  type="text"
                                  placeholder="Tu nombre completo"
                                  className={`w-full px-4 py-3 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-all focus:outline-none ${
                                    form.formState.errors.name
                                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                      : form.formState.touchedFields.name && !form.formState.errors.name
                                      ? "border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                      : "border-slate-700/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.name.message}
                                </p>
                              )}
                            </div>

                            {/* Phone */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Phone className="w-4 h-4 text-blue-400" />
                                Teléfono
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("phone")}
                                  type="tel"
                                  placeholder="+57 300 123 4567"
                                  className={`w-full px-4 py-3 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-all focus:outline-none ${
                                    form.formState.errors.phone
                                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                      : form.formState.touchedFields.phone && !form.formState.errors.phone && form.watch("phone")
                                      ? "border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                      : "border-slate-700/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.phone.message}
                                </p>
                              )}
                            </div>

                            {/* Email (readonly) */}
                            <div className="md:col-span-2">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                Correo Electrónico
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={profile.email}
                                  readOnly
                                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 border-slate-700/50 text-slate-400 cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-linear-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30">
                                  ✓ Verificado
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-6">
                        <motion.button
                          type="button"
                          onClick={() => setActiveSection('general')}
                          className="px-6 py-3 rounded-lg font-semibold text-slate-300 border-2 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isPending}
                          className="relative px-8 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 overflow-hidden group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <span className="relative flex items-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-purple-200 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                      Seguridad y Contraseña
                    </h2>
                    <p className="text-slate-400 mt-2">Protege tu cuenta actualizando tu contraseña regularmente</p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                      {/* Security Card */}
                      <div className="relative rounded-3xl border-2 border-purple-500/25 bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 p-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative space-y-6">
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                            <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                            <div className="text-sm text-slate-400">
                              <p className="font-medium text-purple-300 mb-1">Cambiar Contraseña</p>
                              <p>Deja los campos vacíos si no deseas cambiar tu contraseña. Si cambias contraseña, necesitarás iniciar sesión nuevamente.</p>
                            </div>
                          </div>

                          <div className="space-y-5">
                            {/* Current Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Contraseña Actual
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("currentPassword")}
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Ingresa tu contraseña actual"
                                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-all focus:outline-none ${
                                    form.formState.errors.currentPassword
                                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                      : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.currentPassword.message}
                                </p>
                              )}
                            </div>

                            {/* New Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Nueva Contraseña
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("newPassword")}
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Ingresa una nueva contraseña"
                                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-all focus:outline-none ${
                                    form.formState.errors.newPassword
                                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                      : newPassword && passwordValidation?.strength === 5
                                      ? "border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                      : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                                <div className="mt-4 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(passwordValidation.strength / 5) * 100}%` }}
                                        transition={{ duration: 0.4 }}
                                        className={`h-full ${
                                          passwordValidation.strength === 5
                                            ? "bg-linear-to-r from-green-500 to-emerald-500"
                                            : passwordValidation.strength >= 3
                                            ? "bg-linear-to-r from-yellow-500 to-orange-500"
                                            : "bg-linear-to-r from-red-500 to-orange-500"
                                        }`}
                                      />
                                    </div>
                                    <span
                                      className={`text-xs font-bold whitespace-nowrap ${
                                        passwordValidation.strength === 5
                                          ? "text-green-400"
                                          : passwordValidation.strength >= 3
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {passwordValidation.strength === 5 ? "Muy Fuerte" : passwordValidation.strength >= 3 ? "Media" : "Débil"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${passwordValidation.checks.length ? "text-green-400 bg-green-500/10" : "text-slate-500"}`}>
                                      {passwordValidation.checks.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>8+ caracteres</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${passwordValidation.checks.uppercase ? "text-green-400 bg-green-500/10" : "text-slate-500"}`}>
                                      {passwordValidation.checks.uppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Mayúscula</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${passwordValidation.checks.lowercase ? "text-green-400 bg-green-500/10" : "text-slate-500"}`}>
                                      {passwordValidation.checks.lowercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Minúscula</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${passwordValidation.checks.number ? "text-green-400 bg-green-500/10" : "text-slate-500"}`}>
                                      {passwordValidation.checks.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Número</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${passwordValidation.checks.special ? "text-green-400 bg-green-500/10" : "text-slate-500"}`}>
                                      {passwordValidation.checks.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      <span>Especial (!@#...)</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {form.formState.errors.newPassword && (
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.newPassword.message}
                                </p>
                              )}
                            </div>

                            {/* Confirm Password */}
                            <div className="group relative">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Lock className="w-4 h-4 text-purple-400" />
                                Confirmar Nueva Contraseña
                              </label>
                              <div className="relative">
                                <input
                                  {...form.register("confirmPassword")}
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirma tu nueva contraseña"
                                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-all focus:outline-none ${
                                    form.formState.errors.confirmPassword
                                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                      : confirmPassword && newPassword && confirmPassword === newPassword
                                      ? "border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                      : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {form.formState.errors.confirmPassword.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-6">
                        <motion.button
                          type="button"
                          onClick={() => setActiveSection('general')}
                          className="px-6 py-3 rounded-lg font-semibold text-slate-300 border-2 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isPending}
                          className="relative px-8 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 overflow-hidden group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <span className="relative flex items-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
