import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: <TbTag />,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: <LuUsers />,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Coupons",
    url: "/dashboard/coupons",
    icon: <RiCoupon2Line />,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: <TbBriefcase />,
  },
];
