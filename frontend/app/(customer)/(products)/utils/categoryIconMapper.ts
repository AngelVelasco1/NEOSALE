import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Package,
  Car,
  Book,
  Gamepad2,
  Baby,
  Utensils,
  Music,
  Camera,
  Wrench,
  Flower,
  GlassWater,
  PaintBucket,
  LucideIcon,
} from "lucide-react";

export interface CategoryWithIcon {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  subcategories: {
    id: number;
    name: string;
    active: boolean;
  }[];
  // Propiedades agregadas para la UI
  icon: LucideIcon;
  color: string;
  featured: boolean;
}

export interface CategoryFromAPI {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  subcategories: {
    id: number;
    name: string;
    active: boolean;
  }[];
}

// Mapeo de nombres de categorías a iconos y colores
const categoryIconMap: Record<
  string,
  { icon: LucideIcon; color: string; featured: boolean }
> = {
  // Electrónicos y tecnología
  electronicos: {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  electronica: {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  tecnologia: {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  celulares: {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  computadores: {
    icon: Smartphone,
    color: "from-indigo-500 to-purple-500",
    featured: true,
  },
  laptops: {
    icon: Smartphone,
    color: "from-indigo-500 to-purple-500",
    featured: true,
  },

  // Ropa y moda
  moda: { icon: Shirt, color: "from-purple-500 to-pink-500", featured: true },
  ropa: { icon: Shirt, color: "from-purple-500 to-pink-500", featured: true },
  vestimenta: {
    icon: Shirt,
    color: "from-purple-500 to-pink-500",
    featured: true,
  },
  zapatos: { icon: Shirt, color: "from-rose-500 to-red-500", featured: false },
  calzado: { icon: Shirt, color: "from-rose-500 to-red-500", featured: false },
  accesorios: {
    icon: Shirt,
    color: "from-amber-500 to-orange-500",
    featured: false,
  },

  // Hogar y jardín
  hogar: { icon: Home, color: "from-green-500 to-emerald-500", featured: true },
  casa: { icon: Home, color: "from-green-500 to-emerald-500", featured: true },
  muebles: { icon: Home, color: "from-teal-500 to-cyan-500", featured: false },
  decoracion: {
    icon: Home,
    color: "from-violet-500 to-purple-500",
    featured: false,
  },
  jardin: {
    icon: Flower,
    color: "from-green-400 to-lime-500",
    featured: false,
  },
  cocina: {
    icon: Utensils,
    color: "from-orange-500 to-red-500",
    featured: false,
  },

  // Deportes y fitness
  deportes: {
    icon: Dumbbell,
    color: "from-red-500 to-orange-500",
    featured: false,
  },
  fitness: {
    icon: Dumbbell,
    color: "from-red-500 to-orange-500",
    featured: false,
  },
  ejercicio: {
    icon: Dumbbell,
    color: "from-red-500 to-orange-500",
    featured: false,
  },
  gimnasio: {
    icon: Dumbbell,
    color: "from-red-500 to-orange-500",
    featured: false,
  },

  // Vehículos y transporte
  vehiculos: {
    icon: Car,
    color: "from-gray-500 to-slate-600",
    featured: false,
  },
  carros: { icon: Car, color: "from-gray-500 to-slate-600", featured: false },
  motos: { icon: Car, color: "from-yellow-500 to-orange-500", featured: false },
  transporte: {
    icon: Car,
    color: "from-gray-500 to-slate-600",
    featured: false,
  },

  // Libros y educación
  libros: { icon: Book, color: "from-indigo-500 to-blue-500", featured: false },
  educacion: {
    icon: Book,
    color: "from-indigo-500 to-blue-500",
    featured: false,
  },
  literatura: {
    icon: Book,
    color: "from-indigo-500 to-blue-500",
    featured: false,
  },

  // Gaming y entretenimiento
  gaming: {
    icon: Gamepad2,
    color: "from-purple-600 to-indigo-600",
    featured: true,
  },
  videojuegos: {
    icon: Gamepad2,
    color: "from-purple-600 to-indigo-600",
    featured: true,
  },
  juegos: {
    icon: Gamepad2,
    color: "from-purple-600 to-indigo-600",
    featured: true,
  },
  entretenimiento: {
    icon: Music,
    color: "from-pink-500 to-rose-500",
    featured: false,
  },

  // Bebés y niños
  bebes: { icon: Baby, color: "from-pink-400 to-rose-400", featured: false },
  niños: { icon: Baby, color: "from-blue-400 to-indigo-400", featured: false },
  infantil: {
    icon: Baby,
    color: "from-yellow-400 to-orange-400",
    featured: false,
  },

  // Música y audio
  musica: {
    icon: Music,
    color: "from-purple-500 to-pink-500",
    featured: false,
  },
  audio: { icon: Music, color: "from-blue-500 to-indigo-500", featured: false },
  sonido: {
    icon: Music,
    color: "from-blue-500 to-indigo-500",
    featured: false,
  },

  // Fotografía y video
  fotografia: {
    icon: Camera,
    color: "from-gray-600 to-slate-700",
    featured: false,
  },
  camaras: {
    icon: Camera,
    color: "from-gray-600 to-slate-700",
    featured: false,
  },
  video: { icon: Camera, color: "from-red-500 to-pink-500", featured: false },

  // Herramientas y hardware
  herramientas: {
    icon: Wrench,
    color: "from-orange-500 to-red-500",
    featured: false,
  },
  hardware: {
    icon: Wrench,
    color: "from-slate-500 to-gray-600",
    featured: false,
  },
  construccion: {
    icon: Wrench,
    color: "from-yellow-600 to-orange-600",
    featured: false,
  },

  // Belleza y cuidado personal
  belleza: {
    icon: PaintBucket,
    color: "from-pink-400 to-rose-500",
    featured: false,
  },
  "cuidado personal": {
    icon: PaintBucket,
    color: "from-pink-400 to-rose-500",
    featured: false,
  },
  cosmeticos: {
    icon: PaintBucket,
    color: "from-purple-400 to-pink-500",
    featured: false,
  },

  // Salud y bienestar
  salud: {
    icon: GlassWater,
    color: "from-green-400 to-emerald-500",
    featured: false,
  },
  bienestar: {
    icon: GlassWater,
    color: "from-green-400 to-emerald-500",
    featured: false,
  },
  medicina: {
    icon: GlassWater,
    color: "from-blue-400 to-green-500",
    featured: false,
  },
};

// Valores por defecto para categorías no mapeadas
const defaultCategoryStyle = {
  icon: Package,
  color: "from-gray-500 to-slate-600",
  featured: false,
};

export const mapCategoryWithIcon = (
  category: CategoryFromAPI
): CategoryWithIcon => {
  const normalizedName = category.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .trim();

  // Buscar coincidencia exacta primero
  let categoryStyle = categoryIconMap[normalizedName];

  // Si no hay coincidencia exacta, buscar coincidencias parciales
  if (!categoryStyle) {
    const matchingKey = Object.keys(categoryIconMap).find(
      (key) => normalizedName.includes(key) || key.includes(normalizedName)
    );
    categoryStyle = matchingKey
      ? categoryIconMap[matchingKey]
      : defaultCategoryStyle;
  }

  return {
    ...category,
    icon: categoryStyle.icon,
    color: categoryStyle.color,
    featured: categoryStyle.featured,
  };
};

export const mapCategoriesWithIcons = (
  categories: CategoryFromAPI[]
): CategoryWithIcon[] => {
  return categories.map(mapCategoryWithIcon);
};
