'use client';
import React, { useEffect, useState } from "react";
import { LucideLoader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download, Users } from "lucide-react";
import { db } from "../../../config";
import { userResponses } from "../../../config/schema";
import { eq } from "drizzle-orm";
import * as XLSX from 'xlsx'

const FormListItemResp = ({ formRecord, jsonForm }) => {
    const [responseCount, setResponseCount] = useState(0);
    const [loading, setLoading] = useState(false);
    let jsonData = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await db.select()
                    .from(userResponses)
                    .where(eq(userResponses.formRef, formRecord.id))
                    .orderBy(userResponses.createdAt);
                setResponseCount(result?.length);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);


    const ExportData = async () => {
        setLoading(true);
        try {
            const result = await db.select()
                .from(userResponses)
                .where(eq(userResponses.formRef, formRecord.id))
                .orderBy(userResponses.createdAt);
            setLoading(false);
            result?.map((item) => {
                jsonData.push(JSON.parse(item?.jsonResponse));
            });
            exportToExcel(jsonData);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Convert JSON into EXCEL File to download it
    const exportToExcel = (jsonData) => {
        if (jsonData.length === 0) return;

        // Function to flatten a JSON object
        const flattenObject = (obj, prefix = "") => {
            let flattened = {};

            Object.keys(obj).forEach((key) => {
                const newKey = prefix ? `${prefix} - ${key}` : key;

                if (Array.isArray(obj[key])) {
                    // If the value is an array of objects (e.g., checkbox fields)
                    if (obj[key].every((item) => typeof item === "object")) {
                        flattened[newKey] = obj[key]
                            .filter((item) => item.value) // Only keep selected values
                            .map((item) => item.label)
                            .join(", ");
                    } else {
                        flattened[newKey] = obj[key].join(", "); // Convert arrays to strings
                    }
                } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    // Recursively flatten nested objects
                    Object.assign(flattened, flattenObject(obj[key], newKey));
                } else {
                    flattened[newKey] = obj[key]; // Keep other values as they are
                }
            });

            return flattened;
        };

        // Function to format headers properly
        const formatHeader = (key) => {
            return key
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
                .replace(/_/g, " ")                  // Replace underscores with spaces
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
        };

        // Transform responses & flatten data
        const transformedData = jsonData.map((item) => flattenObject(item));

        // Get original headers from the first response
        const originalHeaders = Object.keys(transformedData[0]);

        // Convert headers to formatted headers
        const formattedHeaders = originalHeaders.map(formatHeader);

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(transformedData, {
            header: originalHeaders, // Use original keys for data mapping
        });

        // Rename column headers in worksheet
        originalHeaders.forEach((key, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // Get Excel cell (e.g., A1, B1)
            worksheet[cellAddress].v = formattedHeaders[index]; // Update cell value
        });

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

        // Save file
        XLSX.writeFile(workbook, jsonForm?.formTitle + ".xlsx");
    };

    return (
        <div className="border shadow-sm rounded-lg p-4 hover:shadow-xl duration-150">
            <div className="h-[100px]">
                <h2 className="font-semibold text-lg">{jsonForm?.formTitle}</h2>
                <p className="text-sm text-gray-500">{jsonForm?.formHeading}</p>
            </div>

            <div className="flex mt-4 gap-4 items-center justify-between ">
                <h2 className='flex gap-2 text-sm'><Users className='h-5 w-5' /> <strong>{responseCount}</strong> Responses</h2>
                <Button
                    onClick={() => ExportData()}
                    disabled={loading}
                    className='flex gap-2' size='sm'>

                    {loading ? <><LucideLoader className="animate-spin" /> Exporting</> : <> <Download className="h-5 w-5" /> Export </>}
                </Button>
            </div>
        </div>
    )
}

export default FormListItemResp;