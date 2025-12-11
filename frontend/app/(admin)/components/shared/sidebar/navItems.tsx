import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";

export const navItems = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Categorias",
    url: "/dashboard/categories",
    icon: <TbTag />,
  },
  {
    title: "Clientes",
    url: "/dashboard/customers",
    icon: <LuUsers />,
  },
  {
    title: "Pedidos",
    url: "/dashboard/orders",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Cupones",
    url: "/dashboard/coupons",
    icon: <RiCoupon2Line />,
  },

];
