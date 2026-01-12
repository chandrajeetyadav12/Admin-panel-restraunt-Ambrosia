"use client";

import React from "react";
import { Box, Typography, Button, MenuItem } from "@mui/material";
import { Stack } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

/* =========================
   VALIDATION SCHEMA
========================= */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  role: yup.string().required("Role is required"),
  image: yup.mixed().nullable(),
});

const AuthRegister = ({ title, subtext, subtitle }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      image: null,
    },
  });

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // SUCCESS TOAST
      toast.success("Registration successful.");

      reset(); // clear form
    } catch (error) {
      console.error(error);

      //  ERROR SWEET ALERT
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight={700} variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack mb={3}>

          {/* NAME */}
          <Typography>Name</Typography>
          <CustomTextField {...register("name")} fullWidth />
          {errors.name && (
            <Typography color="error">{errors.name.message}</Typography>
          )}

          {/* EMAIL */}
          <Typography mt={2}>Email</Typography>
          <CustomTextField {...register("email")} fullWidth />
          {errors.email && (
            <Typography color="error">{errors.email.message}</Typography>
          )}

          {/* PASSWORD */}
          <Typography mt={2}>Password</Typography>
          <CustomTextField
            type="password"
            {...register("password")}
            fullWidth
          />
          {errors.password && (
            <Typography color="error">{errors.password.message}</Typography>
          )}

          {/* ROLE */}
          <Typography mt={2}>Role</Typography>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <CustomTextField select fullWidth {...field}>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </CustomTextField>
            )}
          />
          {errors.role && (
            <Typography color="error">{errors.role.message}</Typography>
          )}

          {/* IMAGE */}
          <Typography mt={2}>Profile Image</Typography>
          <input type="file" {...register("image")} />

        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#fc791a",
            "&:hover": { backgroundColor: "#e66f15" },
          }}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
