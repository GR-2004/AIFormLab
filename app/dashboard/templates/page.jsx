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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import TemplateList from "./_comonents/TemplateList";

const Templates = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-3xl">Templates</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <Input
                        className="pl-10 w-80"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <TemplateList />
            
        </div>
    );
};

export default Templates;
