"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import FormUi from "@/app/edit-form/_components/FormUi";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TemplateCard from "./TemplateCard";

const TemplateList = () => {
    const [templateList, setTemplateList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewForm, setPreviewForm] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        getTemplatesList();
    }, []);

    const getTemplatesList = async () => {
        setLoading(true);
        try {
            const result = await db
                .select()
                .from(JsonForms)
                .where(eq(JsonForms.isTemplate, true)) // Fetch only templates
                .orderBy(desc(JsonForms.id));

            setTemplateList(result);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast.error("Something went wrong while fetching templates.");
        }
        setLoading(false);
    };

    const openPreview = (template) => {
        setPreviewForm(template);
        setIsPreviewOpen(true);
    };

    const handleUseTemplate = async (template) => {
        setLoading(true);
        try {
            const fullName = user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.firstName || "Unknown User";
            const result = await db.insert(JsonForms).values({
                jsonform: template.jsonform,
                theme: template.theme,
                background: template.background,
                style: template.style,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD/MM/YYYY'),
                fullName: fullName
            }).returning({ id: JsonForms.id });

            if (result[0]?.id) {
                toast.success("Template used successfully!");
                router.push('/dashboard');
            } else {
                toast.error("Failed to use the template. Please try again.");
            }
        } catch (error) {
            console.error("Error while using template:", error);
            toast.error("Something went wrong while using the template.");
        }
        setLoading(false);
    };

    return (
        <div className="p-6">
            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <Loader className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-300" />
                </div>
            ) : templateList.length === 0 ? (
                <div className="text-center text-gray-500">No templates found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templateList.map((template, index) => <TemplateCard template={template} key={index} index={index} handleUseTemplate={handleUseTemplate} openPreview={openPreview} />)}
                </div>
            )}

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{previewForm?.formTitle || "Form Preview"}</DialogTitle>
                    </DialogHeader>
                    <div className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center dark:border-gray-700" style={{ background:  previewForm?.background }}>
                        <FormUi
                            jsonForm={previewForm?.jsonform ? JSON.parse(previewForm.jsonform) : null}
                            selectedStyle={previewForm?.style ? JSON.parse(previewForm?.style) : null}
                            selectedTheme={previewForm?.theme}
                            editable={false}
                            formId={previewForm?.id}
                            enabledSignIn={previewForm?.enabledSignIn}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TemplateList;
