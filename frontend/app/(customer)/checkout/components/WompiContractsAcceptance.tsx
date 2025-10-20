"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";


import { ExternalLink, FileText, Shield, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

interface ContractLink {
  url: string;
  type: string;
  title: string;
}

interface ContractLinks {
  termsAndConditions: ContractLink;
  personalDataAuth: ContractLink;
}

interface WompiContractsAcceptanceProps {
  onAcceptanceChange: (
    allAccepted: boolean,
    acceptanceTokens: { [key: string]: string }
  ) => void;
  disabled?: boolean;
}

export const WompiContractsAcceptance: React.FC<
  WompiContractsAcceptanceProps
> = ({ onAcceptanceChange, disabled = false }) => {
  const [contractLinks, setContractLinks] = useState<ContractLinks | null>(
    null
  );
  const [acceptanceTokens, setAcceptanceTokens] = useState<{
    [key: string]: string;
  }>({});
  const [acceptedContracts, setAcceptedContracts] = useState({
    termsAndConditions: false,
    personalDataAuth: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredContract, setHoveredContract] = useState<string | null>(null);

  useEffect(() => {
    const fetchWompiConfig = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
          }/api/payments/config`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("No se pudo obtener la configuración de pagos");
        }

        const { contractLinks: links, acceptanceTokens: tokens } = result.data;

        if (!links || !tokens) {
          throw new Error("Configuración de contratos no disponible");
        }

        setContractLinks(links);

        setAcceptanceTokens({
          termsAndConditions:
            tokens.presigned_acceptance?.acceptance_token || "",
          personalDataAuth:
            tokens.presigned_personal_data_auth?.acceptance_token || "",
        });
      } catch (error) {
        console.error("❌ Error obteniendo configuración de Wompi:", error);
        ErrorsHandler.showError(
          "Error de configuración",
          "No se pudo cargar la información de pagos. Intenta recargar la página."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWompiConfig();
  }, []);

  const handleContractAcceptance = (
    contractType: keyof typeof acceptedContracts,
    accepted: boolean
  ) => {
    const newAcceptedContracts = {
      ...acceptedContracts,
      [contractType]: accepted,
    };

    setAcceptedContracts(newAcceptedContracts);

    const allAccepted = Object.values(newAcceptedContracts).every(Boolean);

    onAcceptanceChange(allAccepted, acceptanceTokens);

  };

  const openContract = (url: string, title: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 overflow-hidden animate-in fade-in duration-500">
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-700">Cargando términos y condiciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contractLinks) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-100/50 overflow-hidden animate-in fade-in duration-500">
        <div className="p-8">
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">No se pudieron cargar los términos</p>
              <p className="text-sm text-gray-600">Intenta recargar la página</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allAccepted = Object.values(acceptedContracts).every(Boolean);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 max-w-full m-auto">
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Términos y Condiciones</h2>
          </div>
        </div>

        <div className="space-y-3">
          <div
            className={`group relative rounded-2xl border-2 transition-all duration-300 ${acceptedContracts.termsAndConditions
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg"
              : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
              }`}
            onMouseEnter={() => setHoveredContract("terms")}
            onMouseLeave={() => setHoveredContract(null)}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0 mt-1">
                  <Checkbox
                    id="terms-conditions"
                    checked={acceptedContracts.termsAndConditions}
                    onCheckedChange={(checked) =>
                      handleContractAcceptance(
                        "termsAndConditions",
                        checked as boolean
                      )
                    }
                    disabled={disabled}
                    className={`w-6 h-6 rounded-lg transition-all ${acceptedContracts.termsAndConditions
                      ? "bg-blue-600/85 border-blue-600/85"
                      : ""
                      }`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label
                      htmlFor="terms-conditions"
                      className="block text-base font-medium text-gray-900 cursor-pointer leading-relaxed"
                    >
                      He leído y acepto los términos de uso
                    </label>

                    <p className="text-sm text-gray-600">
                      Términos y condiciones de uso de la plataforma de pagos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openContract(
                        contractLinks.termsAndConditions.url,
                        contractLinks.termsAndConditions.title
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                    disabled={disabled}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{contractLinks.termsAndConditions.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {acceptedContracts.termsAndConditions && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/85 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>

          <div
            className={`group relative rounded-2xl border-2 transition-all duration-300 ${acceptedContracts.personalDataAuth
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg"
              : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
              }`}
            onMouseEnter={() => setHoveredContract("data")}
            onMouseLeave={() => setHoveredContract(null)}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0 mt-1">
                  <Checkbox
                    id="personal-data-auth"
                    checked={acceptedContracts.personalDataAuth}
                    onCheckedChange={(checked) =>
                      handleContractAcceptance("personalDataAuth", checked as boolean)
                    }
                    disabled={disabled}
                    className={`w-6 h-6 rounded-lg transition-all ${acceptedContracts.personalDataAuth
                      ? "bg-blue-600/85 border-blue-600"
                      : ""
                      }`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label
                      htmlFor="personal-data-auth"
                      className="block text-base font-medium text-gray-900 cursor-pointer leading-relaxed"
                    >
                      Autorizo el tratamiento de mis datos personales
                    </label>

                    <p className="text-sm text-gray-600">
                      Autorización para el manejo y administración de datos personales
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        openContract(
                          contractLinks.personalDataAuth.url,
                          contractLinks.personalDataAuth.title
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                      disabled={disabled}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{contractLinks.personalDataAuth.title}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {acceptedContracts.personalDataAuth && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/85 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {
          allAccepted ? "" : <div
            className={`rounded-2xl p-4 transition-all duration-500
               bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200
              }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-500
                  }`}
              >
                {allAccepted ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-lg  text-amber-900
                  }`}>
                  Debes aceptar todos los términos para continuar
                </p>
                <p className={`text-sm  text-amber-700
                  }`}>

                  Lee y acepta ambos documentos para habilitar el pago
                </p>
              </div>
            </div>
          </div>
        }


      </div>
    </div>
  );
};

export default WompiContractsAcceptance;
