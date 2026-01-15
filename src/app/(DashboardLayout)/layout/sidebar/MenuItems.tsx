import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconLogout
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
type MenuArgs = {
  isLoggedIn: boolean;
  role: string | null;
};
 const getMenuItems = ({ isLoggedIn, role }: MenuArgs) => [
  {
    navlabel: true,
    subheader: "HOME",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/components/admindashboard",
    roles: ["admin"],
  },
    {
    id: uniqueId(),
    title: "Cuisine",
    icon: IconTypography,
    href: "/cuisine/editdelete",
    roles: ["admin"],
  },
      {
    id: uniqueId(),
    title: "MenuSection",
    icon: IconMoodHappy,
    href: "/menuSection/editdelete",
    roles: ["admin"],
  },
      {
    id: uniqueId(),
    title: "Menu Items",
    icon: IconAperture,
    href: "/menuItem/editdelete",
    roles: ["admin"],
  },
  {
    navlabel: true,
    subheader: "AUTH",
  },
  !isLoggedIn &&{
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  !isLoggedIn &&{
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
    isLoggedIn && {
    id: uniqueId(),
    title: "Logout",
    icon: IconLogout,
    action: "logout",
  },

].filter(Boolean)
 .filter((item: any) => {
    if (item.show === false) return false;
    if (item.roles && !item.roles.includes(role || "")) return false;
    return true;
 });

export default getMenuItems;


