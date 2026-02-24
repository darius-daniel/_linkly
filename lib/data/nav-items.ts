import {
  LayoutDashboard,
  Link2,
  ChartNoAxesCombined,
  Settings,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItems = {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const navItems: NavItems[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/links",
    label: "Links",
    icon: Link2,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default navItems;
