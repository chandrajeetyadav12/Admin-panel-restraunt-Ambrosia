import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="username"
          mb="5px"
        >
          Username
        </Typography>
        <CustomTextField variant="outlined" fullWidth />
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <CustomTextField type="password" variant="outlined" fullWidth />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        {/* <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked
              sx={{
                color: "#e66f15",
                "&.Mui-checked": {
                  color: "#e66f15",
                },
              }}
            />}
            label="Remeber this Device"
          />
        </FormGroup> */}
        {/* <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "#e66f15",
          }}
        >
          Forgot Password ?
        </Typography> */}
      </Stack>
    </Stack>
    <Box>
      <Button
        variant="contained"
        size="large"
        fullWidth
        type="button"
        sx={{
          backgroundColor: "#fc791a",
          "&:hover": {
            backgroundColor: "#e66f15",
          },
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          Sign In
        </Link>
      </Button>
    </Box>
    {subtitle}
  </>
);

export default AuthLogin;
