"use client";

import {
  Suspense,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Loader2,
  MenuIcon,
  PackageSearch,
  Search,
  Sparkles,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Profile from "@/app/(admin)/components/shared/header/Profile";
import Notifications from "@/app/(admin)/components/shared/notifications/Notifications";
import { useSession } from "next-auth/react";
import { navItems } from "@/app/(admin)/components/shared/sidebar/navItems";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

type SearchResultType = "section" | "product" | "category";

type SearchableEntry = {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: ReactNode;
  type: SearchResultType;
  meta?: string;
  searchableText: string;
};

const MIN_REMOTE_QUERY_LENGTH = 2;
const DEFAULT_SECTION_LIMIT = 5;
const MAX_RESULTS = 10;

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,

});

const sectionMetadata: Record<string, { description: string; keywords: string }> = {
  Inicio: {
    description: "Resumen de ventas, alertas y KPIs principales.",
    keywords: "inicio panel dashboard kpi ventas resumen",
  },
  Pedidos: {
    description: "Gestiona pedidos, envíos y estados de pago.",
    keywords: "pedidos ordenes envios estados logistica",
  },
  Productos: {
    description: "Actualiza catálogo, stock y precios rápidamente.",
    keywords: "productos inventario stock catalogo sku",
  },
  Categorias: {
    description: "Organiza categorías y subcategorías del catálogo.",
    keywords: "categorias taxonomia subcategorias merchandising",
  },
  Clientes: {
    description: "Consulta comportamiento y segmentación de clientes.",
    keywords: "clientes crm perfiles fidelizacion lealtad",
  },
  Cupones: {
    description: "Crea y controla promociones y cupones activos.",
    keywords: "cupones promociones descuentos campañas",
  },
  Reseñas: {
    description: "Modera reseñas y responde a comentarios clave.",
    keywords: "reseñas comentarios feedback reputacion",
  },
};

const defaultMetadata = {
  description: "Explora esta sección del panel.",
  keywords: "panel administracion",
};

const sectionEntries: SearchableEntry[] = navItems.map((item) => {
  const metadata = sectionMetadata[item.title] ?? defaultMetadata;

  return {
    id: `section-${item.title.toLowerCase()}`,
    title: item.title,
    url: item.url,
    description: metadata.description,
    icon: item.icon,
    type: "section",
    searchableText: `${item.title} ${metadata.description} ${metadata.keywords}`.toLowerCase(),
  } as SearchableEntry;
});

interface SearchResultsListProps {
  query: string;
  minQueryLength: number;
  isLoading: boolean;
  remoteError: string | null;
  results: SearchableEntry[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (entry: SearchableEntry) => void;
}

function SearchResultsList({
  query,
  minQueryLength,
  isLoading,
  remoteError,
  results,
  highlightedIndex,
  onHighlight,
  onSelect,
}: SearchResultsListProps) {
  const normalizedQuery = query.trim();
  const typeLabelMap: Record<SearchResultType, string> = {
    section: "Sección",
    product: "Producto",
    category: "Categoría",
  };

  if (isLoading && normalizedQuery.length >= minQueryLength && !results.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-sm text-slate-300">
        <Loader2 className="h-5 w-5 animate-spin text-blue-200" />
        <p>Buscando resultados...</p>
      </div>
    );
  }

  if (!results.length) {
    let message = "Explora accesos rápidos del panel";
    if (normalizedQuery.length && normalizedQuery.length < minQueryLength) {
      message = `Escribe al menos ${minQueryLength} caracteres para buscar productos y categorías.`;
    } else if (normalizedQuery.length >= minQueryLength) {
      message = "No se encontraron coincidencias. Intenta otro término.";
    }

    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-slate-400">
        <Sparkles className="h-5 w-5 text-blue-200" />
        <p>{message}</p>
        {remoteError && normalizedQuery.length >= minQueryLength && (
          <p className="text-xs text-red-300">{remoteError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ul className="max-h-72 overflow-y-auto rounded-2xl">
        {results.map((item, index) => {
          const isActive = index === highlightedIndex;
          const typeLabel = typeLabelMap[item.type];

          const resolvedIcon = (() => {
            if (!item.icon) {
              return <Sparkles className="h-4 w-4" />;
            }
            if (item.type === "section" && isValidElement(item.icon)) {
              return cloneElement(item.icon, { size: 18 });
            }
            return item.icon;
          })();

          return (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  "group flex w-full items-center justify-between gap-4 border border-transparent px-4 py-3 text-left transition-all duration-150",
                  isActive
                    ? "border-blue-500/40 bg-white/10 text-white shadow-lg shadow-blue-900/30"
                    : "hover:border-white/10 hover:bg-white/5"
                )}
                onMouseEnter={() => onHighlight(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200",
                      isActive && "border-blue-400/50 bg-blue-500/15 text-white"
                    )}
                  >
                    {resolvedIcon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold leading-none text-white">
                        {item.title}
                      </p>
                      {item.meta && (
                        <span className="text-xs font-semibold text-blue-200">
                          {item.meta}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                        {typeLabel}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  className={cn(
                    "h-4 w-4 text-slate-500 transition-colors",
                    isActive && "text-white"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [remoteResults, setRemoteResults] = useState<SearchableEntry[]>([]);
  const [isFetchingRemote, setIsFetchingRemote] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sectionMatches = normalizedQuery
      ? sectionEntries.filter((entry) =>
          entry.searchableText.includes(normalizedQuery)
        )
      : sectionEntries;

    if (!normalizedQuery) {
      return sectionMatches.slice(0, DEFAULT_SECTION_LIMIT);
    }

    const merged = [...remoteResults, ...sectionMatches];
    const deduped = new Map<string, SearchableEntry>();

    merged.forEach((entry) => {
      deduped.set(entry.id, entry);
    });

    return Array.from(deduped.values()).slice(0, MAX_RESULTS);
  }, [query, remoteResults]);

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleResultSelection = useCallback(
    (entry: SearchableEntry) => {
      setIsDesktopOpen(false);
      setIsMobileSearchOpen(false);
      setQuery("");
      setHighlightedIndex(0);
      router.push(entry.url);
    },
    [router]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      if (event.key === "Escape") {
        setIsDesktopOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? results.length - 1 : prev - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleResultSelection(results[highlightedIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsDesktopOpen(false);
    }
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_REMOTE_QUERY_LENGTH) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      fetchControllerRef.current?.abort();
      setRemoteResults([]);
      setRemoteError(null);
      setIsFetchingRemote(false);
      return;
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    setIsFetchingRemote(true);
    setRemoteError(null);

    fetchTimeoutRef.current = setTimeout(() => {
      fetchControllerRef.current?.abort();
      const controller = new AbortController();
      fetchControllerRef.current = controller;

      fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}&limit=5`, {
        signal: controller.signal,
        cache: "no-store",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al buscar en el panel");
          }
          return response.json();
        })
        .then((payload) => {
          const products = payload?.results?.products ?? [];
          const categories = payload?.results?.categories ?? [];

          const remoteEntries: SearchableEntry[] = [
            ...products.map((product: { id: number; name: string; categoryName?: string | null; price: number | null }) => ({
              id: `product-${product.id}`,
              title: product.name,
              url: `/dashboard/products/${product.id}`,
              description: product.categoryName
                ? `Producto dentro de ${product.categoryName}`
                : "Producto del catálogo",
              type: "product" as const,
              icon: <PackageSearch className="h-4 w-4" />,
              meta:
                typeof product.price === "number" && !Number.isNaN(product.price)
                  ? currencyFormatter.format(product.price)
                  : undefined,
              searchableText: `${product.name} ${product.categoryName ?? ""}`.toLowerCase(),
            })),
            ...categories.map((category: { id: number; name: string; description?: string | null }) => ({
              id: `category-${category.id}`,
              title: category.name,
              url: `/dashboard/categories?search=${encodeURIComponent(category.name)}`,
              description: category.description ?? "Categoría del catálogo",
              type: "category" as const,
              icon: <Tags className="h-4 w-4" />,
              searchableText: `${category.name} ${category.description ?? ""}`.toLowerCase(),
            })),
          ];

          setRemoteResults(remoteEntries);
        })
        .catch((error) => {
          if ((error as Error).name === "AbortError") {
            return;
          }
          console.error("Dashboard search request failed", error);
          setRemoteError("No se pudo cargar resultados en vivo.");
          setRemoteResults([]);
        })
        .finally(() => {
          setIsFetchingRemote(false);
        });
    }, 250);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      fetchControllerRef.current?.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(event.target as Node)
      ) {
        setIsDesktopOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (window.innerWidth < 1024) {
          setIsMobileSearchOpen(true);
        } else {
          setIsDesktopOpen(true);
          desktopSearchRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      const timeout = window.setTimeout(() => {
        mobileSearchRef.current?.focus();
      }, 80);

      return () => window.clearTimeout(timeout);
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    setHighlightedIndex((currentIndex) => {
      if (!results.length) {
        return 0;
      }
      return currentIndex >= results.length ? results.length - 1 : currentIndex;
    });
  }, [results.length]);

  return (
    <header className="sticky top-0 z-30 bg-linear-to-r from-slate-900/85 via-slate-800/90 to-slate-900/85 backdrop-blur-xl border-b border-white/10 dark:border-white/5 shadow-2xl">
      <div className="absolute top-0 right-0 h-32 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-24 w-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5 pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 px-4 py-3.5 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:bg-white/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
            <MenuIcon
              size={20}
              strokeWidth={2.5}
              className="relative z-10 text-slate-300 transition-colors duration-300 group-hover:text-white dark:text-slate-400"
            />
          </button>

          <div className="relative hidden md:block">
            <div className="mb-0.5 flex items-center gap-2">
              <h1 className="ml-4 text-lg font-bold tracking-wide text-transparent lg:text-xl bg-linear-to-r from-white via-blue-200 to-purple-200 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text">
                Panel Administrativo
              </h1>
            </div>
            <p className="ml-4 hidden text-sm font-medium tracking-wide text-slate-400 dark:text-slate-500 lg:block">
              ¡{getCurrentGreeting()}!,<span className="text-slate-300 dark:text-slate-400"> {session?.user?.name || "Usuario"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div
            ref={desktopContainerRef}
            className="relative hidden lg:block group"
          >
            <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
              <Search className="size-4 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-400" />
            </div>
            <input
              ref={desktopSearchRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsDesktopOpen(true);
              }}
              onFocus={() => setIsDesktopOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar en el panel..."
              className="w-[240px] rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 hover:bg-white/10 focus:border-blue-400/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 focus:shadow-lg focus:shadow-blue-500/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 dark:focus:border-blue-500/30 dark:focus:ring-blue-500/5 xl:w-[300px]"
              aria-label="Buscar"
              role="combobox"
              aria-expanded={isDesktopOpen}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-slate-400 lg:flex">
              <span>Ctrl</span>
              <span>K</span>
            </div>

            {isDesktopOpen && (
              <div className="absolute left-0 right-0 z-40 mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-white shadow-2xl shadow-blue-900/40 backdrop-blur-xl">
                <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500">
                  <span>Búsqueda rápida</span>
                  <span className="flex items-center gap-1 text-blue-200">
                    {isFetchingRemote ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Cargando
                      </>
                    ) : (
                      <>
                      </>
                    )}
                  </span>
                </div>
                {remoteError && query.trim().length >= MIN_REMOTE_QUERY_LENGTH && (
                  <p className="px-2 pb-2 text-[11px] text-red-300">
                    {remoteError}
                  </p>
                )}
                <SearchResultsList
                  query={query}
                  minQueryLength={MIN_REMOTE_QUERY_LENGTH}
                  isLoading={isFetchingRemote}
                  remoteError={remoteError}
                  results={results}
                  highlightedIndex={highlightedIndex}
                  onHighlight={setHighlightedIndex}
                  onSelect={handleResultSelection}
                />
                <div className="flex items-center justify-between px-3 pt-3 text-[11px] text-slate-500">
                  <span>Usa ↑ ↓ para navegar</span>
                  <span className="flex items-center gap-1">
                    <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px]">Enter</span>
                    Abrir
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 lg:hidden"
            onClick={() => {
              setIsMobileSearchOpen(true);
              setIsDesktopOpen(false);
            }}
            aria-label="Buscar en el panel"
          >
            <Search className="h-5 w-5 text-slate-300 dark:text-slate-400" />
          </Button>

          <Dialog open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
            <DialogContent className="w-full max-w-2xl border border-white/10 bg-slate-950/95 text-white">
              <DialogHeader>
                <DialogTitle>Buscar en el panel</DialogTitle>
              </DialogHeader>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  ref={mobileSearchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe lo que necesitas gestionar..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5">
                {remoteError && query.trim().length >= MIN_REMOTE_QUERY_LENGTH && (
                  <p className="px-4 pt-3 text-xs text-red-300">
                    {remoteError}
                  </p>
                )}
                <SearchResultsList
                  query={query}
                  minQueryLength={MIN_REMOTE_QUERY_LENGTH}
                  isLoading={isFetchingRemote}
                  remoteError={remoteError}
                  results={results}
                  highlightedIndex={highlightedIndex}
                  onHighlight={setHighlightedIndex}
                  onSelect={handleResultSelection}
                />
              </div>
              <p className="text-xs text-slate-400">Tip: mantén pulsado Ctrl + K para abrir este buscador en cualquier momento.</p>
            </DialogContent>
          </Dialog>

          <Suspense
            fallback={
              <div className="h-10 w-10 animate-pulse rounded-xl border border-white/10 bg-white/5 dark:border-white/5 dark:bg-white/5" />
            }
          >
            <Notifications />
          </Suspense>

          <div className="mx-1 hidden h-8 w-px bg-white/10 dark:bg-white/5 sm:block" />

          <Suspense
            fallback={
              <div className="h-10 w-24 animate-pulse rounded-xl border border-white/10 bg-white/5 dark:border-white/5 dark:bg-white/5" />
            }
          >
            <Profile />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
