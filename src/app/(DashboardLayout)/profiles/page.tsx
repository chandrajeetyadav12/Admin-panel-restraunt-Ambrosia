"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Avatar,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
}

/* =======================
   Yup Validation Schema
======================= */
const profileSchema = yup.object({
    name: yup
        .string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters"),
});

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState<File | null>(null);

    /* =======================
       React Hook Form
    ======================= */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(profileSchema),
    });

    /* =======================
       GET PROFILE
    ======================= */
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
            reset({ name: res.data.name });
        } catch {
            toast.error("Failed to load profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /* =======================
       UPDATE PROFILE
    ======================= */
    const onSubmit = async (data: any) => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const formData = new FormData();
            formData.append("name", data.name);
            if (image) formData.append("image", image);

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUser(res.data.user);
            toast.success("Profile updated successfully");
            setOpen(false);
        } catch {
            toast.error("Profile update failed");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <Box
            sx={{
                border: "1px solid #e0e0e0",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                p: 3,
                backgroundColor: "#fff",
            }}
            maxWidth={900} mx="auto" mt={5} textAlign="center"
        >
            <ToastContainer position="top-right" />

            {/* =======================
         Profile View
      ======================= */}
            <Avatar
                src={user.image || "/images/profile/user-1.jpg"}
                sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
            />

            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography color="text.secondary">Role: {user.role}</Typography>

            <Button
                variant="contained"
                sx={{ mt: 3, backgroundColor: "#fc791a" }}
                onClick={() => setOpen(true)}
            >
                Edit Profile
            </Button>

            {/* =======================
         Edit Profile Dialog
      ======================= */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>

                <DialogContent>
                    <Box component="form">
                        <TextField
                            fullWidth
                            label="Name"
                            margin="normal"
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ mt: 2 }}
                        >
                            Change Image
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setImage(e.target.files?.[0] || null)
                                }
                            />
                        </Button>
                        {image && (
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, color: "text.secondary" }}
                            >
                                Selected file: {image.name}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        disabled={saving}
                        sx={{ backgroundColor: "#fc791a" }}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
