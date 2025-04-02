"use client";
import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <section className="max-w-[1376px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen overflow-hidden">
      <div className="flex flex-col md:items-center md:flex-row gap-4 md:gap-6">
        <div className="w-full inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold break-words">
            My Forms
          </h1>
          <p className="text-base font-medium break-words text-muted-foreground">
            Recently created forms
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <CreateForm />
          <Button variant="outline" className="w-full" onClick={() => router.push("/templates")}>
            View Templates
          </Button>
        </div>
      </div>
      <FormList />
    </section>
  );
}
