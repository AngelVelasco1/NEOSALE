import type { ReactNode } from "react";

import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdOutlineRateReview } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdStore } from "react-icons/md";

type NavItem = {
  title: string;
  url: string;
  icon: ReactNode;
  accent: string;
};

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: <MdOutlineDashboard />,
    accent: "from-cyan-500/25 via-blue-500/15 to-transparent",
  },
  {
    title: "Pedidos",
    url: "/dashboard/orders",
    icon: <TbTruckDelivery />,
    accent: "from-amber-500/25 via-orange-500/15 to-transparent",
  },
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: <MdOutlineShoppingCart />,
    accent: "from-emerald-500/25 via-teal-500/15 to-transparent",
  },
  {
    title: "Categorias",
    url: "/dashboard/categories",
    icon: <TbTag />,
    accent: "from-purple-500/25 via-indigo-500/15 to-transparent",
  },
  {
    title: "Clientes",
    url: "/dashboard/customers",
    icon: <LuUsers />,
    accent: "from-pink-500/25 via-rose-500/15 to-transparent",
  },
  {
    title: "Cupones",
    url: "/dashboard/coupons",
    icon: <RiCoupon2Line />,
    accent: "from-sky-500/25 via-blue-500/15 to-transparent",
  },
  {
    title: "Reseñas",
    url: "/dashboard/reviews",
    icon: <MdOutlineRateReview />,
    accent: "from-lime-500/25 via-emerald-500/15 to-transparent",
  },
  {
    title: "Personalizar Tienda",
    url: "/dashboard/store-settings",
    icon: <MdStore />,
    accent: "from-violet-500/25 via-purple-500/15 to-transparent",
  },

];
