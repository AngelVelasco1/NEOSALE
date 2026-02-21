import {
  Home,
  Calendar,
  Package,
  Users,
  User,
  MessageSquare,
  Tags,
  Gift,
  Settings,
  LogOut,
  ShoppingCart,
  TrendingUp,
  FileText,
  ChevronDown,
  Type,
  Table,
  PieChart,
  LayoutGrid,
  Lock,
  type LucideIcon,
} from "lucide-react";

// Map icon names to lucide icons
const Icons = {
  HomeIcon: Home,
  Calendar: Calendar,
  Packages: Package,
  Users: Users,
  User: User,
  MessageSquare: MessageSquare,
  Tags: Tags,
  Gift: Gift,
  Settings: Settings,
  LogOut: LogOut,
  ShoppingCart: ShoppingCart,
  TrendingUp: TrendingUp,
  FileText: FileText,
  ChevronDown: ChevronDown,
  Alphabet: Type,
  Table: Table,
  PieChart: PieChart,
  FourCircle: LayoutGrid,
  Authentication: Lock,
};

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/login",
          },
        ],
      },
    ],
  },
];
