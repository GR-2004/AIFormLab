"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./Header";
import { useTheme } from "next-themes"; // Import the useTheme hook

const Hero = () => {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={`min-h-screen ${currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header />
      <section className={`min-h-[calc(100vh-60px)] ${currentTheme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen">
          <div className="mx-auto max-w-xl text-center">
            <h1
              className={`bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl ${currentTheme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Create Your Forms
              <span className="sm:block"> With AI </span>
            </h1>

            <p className={`mx-auto mt-4 max-w-xl sm:text-xl/relaxed ${currentTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Build custom forms instantly using AI. Transform your ideas into professional forms with
              natural language - no coding required.
            </p>

            <div className="mt-8 flex flex-wrap justify-center items-center">
              <Link
                className={`block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-opacity-75 sm:w-auto ${currentTheme === "dark" ? "hover:bg-blue-500" : "hover:bg-blue-700"}`}
                href="/my-forms"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;