"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useRouter } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Search, Loader } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import TemplateList from "./_comonents/TemplateList";
import Image from "next/image";
import EmptyStatePlaceholder from "../_components/EmptyStatePlaceholder";

const Templates = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);

  // Filter templates based on search
  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="max-w-[1376px] mx-auto p-8 flex flex-col gap-8 min-h-screen">
      <div className="flex items-center w-full gap-8">
        <div className="w-full inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-3xl font-semibold break-words">Templates</h1>
          <p className="text-base font-medium break-words text-muted-foreground">
            Recently Created Templates
          </p>
        </div>
        <div className="relative w-80 ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            placeholder='Search Templates e.g. "Cricket form"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {filteredTemplates.length === 0 ? (
        <EmptyStatePlaceholder
          title="No templates found"
          description={
            searchQuery
              ? `No templates matching "${searchQuery}"`
              : "No templates available at the moment"
          }
        />
      ) : (
        <TemplateList columns={4} searchQuery={searchQuery} />
      )}
    </section>
  );
};

export default Templates;
