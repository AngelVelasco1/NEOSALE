/**
 * Dynamic Style Utilities
 * Helpers para usar variables CSS dinámicas en estilos inline
 */

export const dynamicStyles = {
  // Gradientes
  gradientPrimaryToSecondary: (angle = "to right") => ({
    backgroundImage: `linear-gradient(${angle}, var(--color-primary), var(--color-secondary))`,
  }),

  gradientPrimaryToAccent: (angle = "to right") => ({
    backgroundImage: `linear-gradient(${angle}, var(--color-primary), var(--color-accent))`,
  }),

  gradientSecondaryToAccent: (angle = "to right") => ({
    backgroundImage: `linear-gradient(${angle}, var(--color-secondary), var(--color-accent))`,
  }),

  gradientAllThree: (angle = "to right") => ({
    backgroundImage: `linear-gradient(${angle}, var(--color-primary), var(--color-secondary), var(--color-accent))`,
  }),

  // Gradientes radiantes
  radialPrimary: (opacity = 0.15) => ({
    backgroundImage: `radial-gradient(circle, rgba(var(--color-primary-rgb), ${opacity}), transparent)`,
  }),

  radialSecondary: (opacity = 0.15) => ({
    backgroundImage: `radial-gradient(circle, rgba(var(--color-secondary-rgb), ${opacity}), transparent)`,
  }),

  radialAccent: (opacity = 0.1) => ({
    backgroundImage: `radial-gradient(circle, rgba(var(--color-accent-rgb), ${opacity}), transparent)`,
  }),

  // Sombras
  shadowPrimary: (blur = 16, opacity = 0.3) => ({
    boxShadow: `0 0 ${blur}px rgba(var(--color-primary-rgb), ${opacity})`,
  }),

  shadowSecondary: (blur = 16, opacity = 0.3) => ({
    boxShadow: `0 0 ${blur}px rgba(var(--color-secondary-rgb), ${opacity})`,
  }),

  shadowAccent: (blur = 16, opacity = 0.3) => ({
    boxShadow: `0 0 ${blur}px rgba(var(--color-accent-rgb), ${opacity})`,
  }),

  // Colores de texto
  textGradientPrimary: () => ({
    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as React.CSSProperties),

  textGradientAccent: () => ({
    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-accent))`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as React.CSSProperties),

  // Colores sólidos
  primaryColor: () => ({ color: "var(--color-primary)" }),
  secondaryColor: () => ({ color: "var(--color-secondary)" }),
  accentColor: () => ({ color: "var(--color-accent)" }),

  primaryBg: (opacity = 1) => ({
    backgroundColor:
      opacity === 1
        ? "var(--color-primary)"
        : `rgba(var(--color-primary-rgb), ${opacity})`,
  }),

  secondaryBg: (opacity = 1) => ({
    backgroundColor:
      opacity === 1
        ? "var(--color-secondary)"
        : `rgba(var(--color-secondary-rgb), ${opacity})`,
  }),

  accentBg: (opacity = 1) => ({
    backgroundColor:
      opacity === 1
        ? "var(--color-accent)"
        : `rgba(var(--color-accent-rgb), ${opacity})`,
  }),

  // Bordes
  primaryBorder: () => ({ borderColor: "var(--color-primary)" }),
  secondaryBorder: () => ({ borderColor: "var(--color-secondary)" }),
  accentBorder: () => ({ borderColor: "var(--color-accent)" }),

  // Efectos hover comunes
  hoverGlowPrimary: (hoverClass?: string) => {
    return {
      default: {
        transition: "all 0.3s duration-300",
      },
      hover: {
        boxShadow: `0 0 20px rgba(var(--color-primary-rgb), 0.4)`,
        backgroundColor: `rgba(var(--color-primary-rgb), 0.1)`,
      },
    };
  },
};

// Hook para aplicar estilos dinámicos fácilmente
export const useDynamicStyle = (styleKey: keyof typeof dynamicStyles, ...args: any[]) => {
  const style = dynamicStyles[styleKey];
  if (typeof style === "function") {
    return style(...args);
  }
  return style;
};
