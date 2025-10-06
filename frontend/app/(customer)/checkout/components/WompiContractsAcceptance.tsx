"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Shield } from "lucide-react";
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

  // 🎯 Obtener configuración de Wompi al montar el componente
  useEffect(() => {
    const fetchWompiConfig = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
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

        // Extraer tokens de los contratos
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

  // 🎯 Manejar cambios en los checkboxes
  const handleContractAcceptance = (
    contractType: keyof typeof acceptedContracts,
    accepted: boolean
  ) => {
    const newAcceptedContracts = {
      ...acceptedContracts,
      [contractType]: accepted,
    };

    setAcceptedContracts(newAcceptedContracts);

    // Verificar si todos los contratos están aceptados
    const allAccepted = Object.values(newAcceptedContracts).every(Boolean);

    // Notificar al componente padre
    onAcceptanceChange(allAccepted, acceptanceTokens);

    console.log("📋 Estado de aceptación de contratos:", {
      termsAndConditions: newAcceptedContracts.termsAndConditions,
      personalDataAuth: newAcceptedContracts.personalDataAuth,
      allAccepted,
    });
  };

  // 🎯 Abrir contrato en nueva ventana
  const openContract = (url: string, title: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    console.log(`📄 Abriendo contrato: ${title}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Términos y Condiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-muted-foreground">
              Cargando términos...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contractLinks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Términos y Condiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No se pudieron cargar los términos y condiciones.</p>
            <p className="text-sm">Intenta recargar la página.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Aceptación de Términos y Condiciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 🎯 PASO 3: Términos y Condiciones de Uso */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
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
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="terms-conditions"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                He leído y acepto los{" "}
                <button
                  type="button"
                  onClick={() =>
                    openContract(
                      contractLinks.termsAndConditions.url,
                      contractLinks.termsAndConditions.title
                    )
                  }
                  className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                  disabled={disabled}
                >
                  {contractLinks.termsAndConditions.title}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Términos y condiciones de uso de la plataforma de pagos
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 PASO 3: Autorización de Datos Personales */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="personal-data-auth"
              checked={acceptedContracts.personalDataAuth}
              onCheckedChange={(checked) =>
                handleContractAcceptance("personalDataAuth", checked as boolean)
              }
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="personal-data-auth"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                Autorizo el tratamiento de mis datos personales según la{" "}
                <button
                  type="button"
                  onClick={() =>
                    openContract(
                      contractLinks.personalDataAuth.url,
                      contractLinks.personalDataAuth.title
                    )
                  }
                  className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                  disabled={disabled}
                >
                  {contractLinks.personalDataAuth.title}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Autorización para el manejo y administración de datos personales
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 Indicador de estado */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Shield
            className={`w-5 h-5 ${
              Object.values(acceptedContracts).every(Boolean)
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          />
          <span className="text-sm">
            {Object.values(acceptedContracts).every(Boolean)
              ? "✅ Todos los términos han sido aceptados"
              : "⏳ Debes aceptar todos los términos para continuar"}
          </span>
        </div>

        {/* 🎯 Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Los contratos se abren en una nueva ventana</p>
          <p>
            • Es obligatorio aceptar ambos términos para proceder con el pago
          </p>
          <p>
            • Los datos se procesan de acuerdo con la normativa de protección de
            datos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WompiContractsAcceptance;
