"use client";
import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
display: "inline-block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/logo.svg" alt="logo" height={70} width={174} priority/>
    </LinkStyled>
  );
};

export default Logo;
  