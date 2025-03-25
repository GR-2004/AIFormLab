"use client";
import { SignedIn } from "@clerk/nextjs";
import React from "react";
import SideNav from "../my-forms/_components/SideNav";
import Header from "../_components/Header";


const SuccessLayout = ({ children }) => {
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

export default SuccessLayout;