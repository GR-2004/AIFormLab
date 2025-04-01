"use client";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import SideNav from "./_components/SideNav";
import React from "react";
import Header from "../_components/Header";
import { Navbar } from "../_components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  );
};

export default DashboardLayout;