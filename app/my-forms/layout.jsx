"use client";
import { SignedIn } from "@clerk/nextjs";
import SideNav from "./_components/SideNav";
import React from "react";
import Header from "../_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <SignedIn>
      <div className="min-h-screen pt-[70px]">
        <Header />
        <div className="md:w-64 fixed">
          <SideNav/>
        </div>

        <div className="md:ml-64">{children}</div>
      </div>
    </SignedIn>
  );
};

export default DashboardLayout;