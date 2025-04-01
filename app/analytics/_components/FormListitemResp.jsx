"use client";
import { db } from "@/config";
import { userResponses } from "@/config/schema";
import { eq } from "drizzle-orm";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const FormListItemResp = ({ formRecord, jsonForm, setTotalResponses }) => {
    const { theme } = useTheme();
    const [responseCount, setResponseCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await db.select()
                    .from(userResponses)
                    .where(eq(userResponses.formRef, formRecord.id))
                    .orderBy(userResponses.createdAt);
                setResponseCount(result?.length);
                setTotalResponses((prev) => prev + result?.length);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex items-center justify-between p-4 
                        bg-white dark:bg-zinc-900 
                        border border-gray-200 dark:border-zinc-800 
                        rounded-lg transition-colors 
                        hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                onClick={() => router.push(`/analytics/form/${formRecord?.id}`)}>
            <div>
                <h3 className="text-gray-900 dark:text-white font-medium">{jsonForm?.formTitle}</h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">{formRecord?.createdAt}</p>
            </div>
            <div className="text-gray-600 dark:text-zinc-400 text-sm">
                {responseCount} responses
            </div>
        </div>
    );
}

export default FormListItemResp;
