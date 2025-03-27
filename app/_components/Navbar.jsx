"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuList = [
  {
    id: 0,
    name: "Home",
    path: "/",
  },
  {
    id: 1,
    name: "My Forms",
    path: "/my-forms",
  },

  {
    id: 2,
    name: "Responses",
    path: "/responses",
  },

  {
    id: 3,
    name: "Analytics",
    path: "/analytics",
  },

  {
    id: 4,
    name: "Templates",
    path: "/templates",
  },

  // {
  //     id: 5,
  //     name: "Upgrade",
  //     icon: Shield,
  //     path: "/dashboard/upgrade",
  // },
];

export const Navbar = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className=" fixed top-0 left-0 w-full z-50 mx-auto px-4 md:px-8 py-4 border-b bg-background">
      {isSignedIn ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Image
              src={"/formify-logo.svg"}
              width={118}
              height={36}
              alt="logo"
            />
            <div className="flex items-center gap-6">
              {menuList.map((menu, index) => (
                <Link
                  href={menu.path}
                  key={menu.id}
                  className={`text-sm font-semibold flex items-center gap-3 text-muted-foreground 
            hover:text-foreground rounded-lg cursor-pointer text-gray-500
           `}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </div>

          <UserButton />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Image src={"/formify-logo.svg"} width={118} height={36} alt="logo" />
          <div className="flex items-center gap-6">
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline">Sign up</Button>
            </SignUpButton>
          </div>
        </div>
      )}
    </div>
  );
};
