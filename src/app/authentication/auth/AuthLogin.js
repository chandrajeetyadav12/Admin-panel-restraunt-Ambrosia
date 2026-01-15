"use client";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});

const AuthLogin = ({ title, subtitle, subtext }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      //  SAVE TOKEN (OPTIONAL BUT RECOMMENDED)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      //  SUCCESS TOAST
      toast.success("Login successful");
      router.replace("/");


    } catch (error) {
      // ERROR SWEET ALERT
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          "Invalid email or password",
      });
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack>

          {/* EMAIL */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              {...register("email")}
              variant="outlined"
              fullWidth
            />
            {errors.email && (
              <Typography color="error">
                {errors.email.message}
              </Typography>
            )}
          </Box>

          {/* PASSWORD */}
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              type="password"
              {...register("password")}
              variant="outlined"
              fullWidth
            />
            {errors.password && (
              <Typography color="error">
                {errors.password.message}
              </Typography>
            )}
          </Box>

        </Stack>

        {/* BUTTON */}
        <Box mt={3}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#fc791a",
              "&:hover": {
                backgroundColor: "#e66f15",
              },
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
