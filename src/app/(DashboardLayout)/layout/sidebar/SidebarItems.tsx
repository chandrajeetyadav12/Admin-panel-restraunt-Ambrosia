"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from "@tabler/icons-react";

import getMenuItems from "./MenuItems";
import { useState,useEffect } from "react";

const SidebarItems = () => {
  const pathname = usePathname();
  const router = useRouter();
  // const [role, setRole] = useState<string | null>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(
  typeof window !== "undefined" ? localStorage.getItem("role") : null
);
const [isLoggedIn, setIsLoggedIn] = useState(
  typeof window !== "undefined" && !!localStorage.getItem("token")
);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      console.log(storedRole)
      const token = localStorage.getItem("token");

      setRole(storedRole);
      setIsLoggedIn(!!token);
    }
  }, []);
//   const isLoggedIn =
//     typeof window !== "undefined" &&!!localStorage.getItem("token");
// const role =
//   typeof window !== "undefined"
//     ? localStorage.getItem("role"): null;


  //  LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.clear();
      router.push("/authentication/login");
    }
  };

  const renderMenuItems = (items: any[]) =>
    items.map((item) => {
      const Icon = item.icon || IconPoint;
      const itemIcon = <Icon size="1.3rem" color="#fff" />;

      //  Subheader
      if (item.subheader) {
        return (
          <Box
            key={item.subheader}
            sx={{
              "& .MuiListSubheader-root": {
                color: "#fff",
                fontWeight: 700,
              },
            }}
          >
            <Menu subHeading={item.subheader} />
          </Box>
        );
      }

      //  Logout (SPECIAL CASE)
      if (item.action === "logout") {
        return (
          <Box
            key={item.id}
            px={3}
            sx={{
              cursor: "pointer",
              "& .MuiTypography-root": {
                color: "#fff",
                fontWeight: 700,
              },
              "&:hover .MuiTypography-root": {
                color: "#e66f15",
              },
            }}
            onClick={handleLogout}
          >
            <MenuItem icon={itemIcon} component="div">
              {item.title}
            </MenuItem>
          </Box>
        );
      }

      //  Normal Menu Item
      return (
        <Box px={3} key={item.id}
          sx={{
            borderRadius: "8px",
            color: "#fff",
            fontWeight: 700,

            "& .MuiTypography-root": {
              color: "#fff",
              fontWeight: 700,
            },

            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },

            "&:hover .MuiTypography-root": {
              color: "#e66f15",
            },

            "&.Mui-selected .MuiTypography-root": {
              color: "#e66f15",
            },
          }}
        >
          <MenuItem
            icon={itemIcon}
            component={Link}
            link={item.href}
            isSelected={pathname === item.href}

          >
            {item.title}
          </MenuItem>
        </Box>
      );
    });

  return (
    <MUI_Sidebar
      width="100%"
      showProfile={false}
      themeColor="#111"
      themeSecondaryColor="#fff"
    >
      {/* Logo */}
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link href="/">
          <Image
            src="/images/logos/logo.svg"
            alt="logo"
            width={190}
            height={80}
            priority
          />
        </Link>
      </Box>

      {/* Menu */}

      {renderMenuItems(getMenuItems({ isLoggedIn, role }))}


    </MUI_Sidebar>
  );
};

export default SidebarItems;
