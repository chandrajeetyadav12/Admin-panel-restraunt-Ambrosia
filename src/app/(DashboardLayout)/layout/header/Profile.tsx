"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconMail, IconUser } from "@tabler/icons-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile AFTER mount
  useEffect(() => {
    if (!mounted) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [mounted]);

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

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={(e) => setAnchorEl2(e.currentTarget)}
      >
        <Avatar
          src={user?.image || "/images/profile/user-1.jpg"}
          alt={user?.name || "User"}
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: 200 } }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            router.push("/profiles");
          }}
        >
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <Box mt={1} px={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            sx={{ backgroundColor: "#fc791a", color: "#fff" }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
