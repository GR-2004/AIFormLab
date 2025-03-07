import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const TemplateCard = ({ template, handleUseTemplate, openPreview, index }) => {
    const router = useRouter();
    const jsonForm = template?.jsonform ? JSON.parse(template.jsonform) : null;
    const gradientColors = [
        "bg-gradient-to-r from-blue-500 to-purple-500",
        "bg-gradient-to-r from-green-500 to-teal-500",
        "bg-gradient-to-r from-yellow-500 to-orange-500",
        "bg-gradient-to-r from-red-500 to-pink-500",
    ];
    const headerClass = gradientColors[index % gradientColors.length];

    return (
        <Card key={template.id} className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.03]">
            <CardHeader className={`${headerClass} text-white p-4 text-xl font-semibold`}>
                {jsonForm?.formTitle || "Untitled Form"}
            </CardHeader>
            <CardContent className="p-4 text-gray-700 dark:text-gray-300">
                <p className="text-sm font-medium">Created by: {template.fullName}</p>
            </CardContent>
            <CardFooter className="p-4 flex gap-2">
                <Button className="w-1/2" variant="outline" onClick={() => handleUseTemplate(template)}>
                    Use Template
                </Button>
                <Button className="w-1/2" variant="default" onClick={() => openPreview(template)}>
                    Preview
                </Button>
            </CardFooter>
        </Card>
    );
}

export default TemplateCard;