"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const path = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();

  // Get the correct theme after mount
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    !path.includes("aiform") && (
      <div className="fixed top-0 left-0 w-full z-50 p-5 border-b shadow-sm bg-background">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src={"/logo.svg"} width={200} height={40} alt="logo" />
          </Link>

          <div className="flex items-center gap-5">
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              onClick={() =>
                setTheme(currentTheme === "dark" ? "light" : "dark")
              }
              className="border-gray-300 dark:border-gray-600 dark:text-white"
            >
              {currentTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {/* Auth Buttons */}
            {isSignedIn ? (
              <>
                <Link href={"/dashboard"}>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <SignInButton>
                <Button>Get Started</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Header;
