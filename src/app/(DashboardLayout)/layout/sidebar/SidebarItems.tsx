"use client";
import React from "react";
import Menuitems from "./MenuItems";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upgrade } from "./Updrade";


const renderMenuItems = (items: any, pathDirect: any) => {

  return items.map((item: any) => {

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" color="#fff" />;

    if (item.subheader) {
      // Display Subheader
      return (
        <Box
        key={item.subheader}
        sx={{
          "& .MuiListSubheader-root": {
            color: "#fff",
            fontWeight: 700,
          },
        }}>
          <Menu
            subHeading={item.subheader}
            key={item.subheader}

          />
        </Box>
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'

        >
          {renderMenuItems(item.children, pathDirect)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <Box px={3} key={item.id} sx={{
        "& .MuiTypography-root": {
          color: pathDirect === item.href ? "#e66f15" : "#fff",fontWeight: 700,

        },
        "&:hover .MuiTypography-root": {
          color: "#e66f15",
        },
      }}
      >
        <MenuItem
          key={item.id}
          isSelected={pathDirect === item?.href}
          borderRadius='8px'
          icon={itemIcon}
          link={item.href}
          component={Link}

        >
          {item.title}
        </MenuItem >
      </Box>

    );
  });
};


const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    < >
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={"#111"} themeSecondaryColor={'#fff'} >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0",
            backgroundColor: "#111"
          }}
        >
          <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src="/images/logos/logo.svg"
              alt="logo"
              width={190}
              height={80}
              priority
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Link>
        </Box>

        {renderMenuItems(Menuitems, pathDirect)}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>

    </>
  );
};
export default SidebarItems;
