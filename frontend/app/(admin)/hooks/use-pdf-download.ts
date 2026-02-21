"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function usePdfDownload() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadTemplate = async ({
    htmlId,
    pdfName,
  }: {
    htmlId: string;
    pdfName: string;
  }) => {
    const templateElement = document.getElementById(htmlId);

    if (!templateElement) {
      
      return;
    }

    setIsLoading(true);

    try {
      // Create canvas with optimized configuration
      const canvas = await html2canvas(templateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
      });

      // Create PDF with A4 format
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Calculate dimensions to fit A4
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add image to PDF fitted to page
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

      // Save PDF
      pdf.save(`${pdfName}.pdf`);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadTemplate, isLoading };
}
