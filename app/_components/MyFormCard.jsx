"use client";
import React, { useEffect, useState } from "react";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { Edit, EllipsisVertical, FileText, Share, Trash2 } from "lucide-react";
import { JsonForms, userResponses } from "@/config/schema";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MyFormCard = ({ jsonForm, formRecord, refreshData, setTotalResponses }) => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [renameTitle, setRenameTitle] = useState(jsonForm?.formTitle || "");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await db
          .select()
          .from(userResponses)
          .where(eq(userResponses.formRef, formRecord.id))
          .orderBy(userResponses.createdAt);
        setResponseCount(result?.length);
        setTotalResponses?.((prev) => prev + result?.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

const deleteForm = async () => {
    try {
      setLoading(true);

      // Check if the form has any responses
      const responses = await db
        .select()
        .from(userResponses)
        .where(eq(userResponses.formRef, formRecord.id));

      if (responses.length > 0) {
        toast.error("This form cannot be deleted as it has responses.");
        setDeleteModalOpen(false);
        setLoading(false);
        return;
      }

      // Proceed to delete the form if no responses exist
      await db.delete(JsonForms).where(eq(JsonForms.id, formRecord.id));
      toast.success("Form deleted successfully!");
      refreshData();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const updateFormTitle = async () => {
  if (!renameTitle.trim()) {
    toast.error("Title cannot be empty!");
    return;
  }

  try {

    const [existingForm] = await db
      .select({ jsonform: JsonForms.jsonform })
      .from(JsonForms)
      .where(eq(JsonForms.id, formRecord.id));

    if (!existingForm) {
      throw new Error("Form not found");
    }

    const updatedJson = JSON.stringify({
      ...JSON.parse(existingForm.jsonform),
      formTitle: renameTitle, 
    });

    // Update database with new jsonform
    const result = await db
      .update(JsonForms)
      .set({ jsonform: updatedJson }) 
      .where(eq(JsonForms.id, formRecord.id))
      .returning({ id: JsonForms.id, jsonform: JsonForms.jsonform });

    if (!result || result.length === 0) {
      throw new Error("Update failed");
    }

    toast.success("Form renamed successfully!");
    refreshData();
    setRenameModalOpen(false);
  } catch (error) {
    toast.error("Something went wrong");
  }
};


  return (
    <div className="relative group border rounded-lg overflow-hidden flex flex-col justify-between items-center gap-4 p-5 bg-white w-full min-h-[220px] shadow-md hover:shadow-lg transition-all">
      <img src={"./formCard-bg.svg"} alt={"bg-image"} className="absolute bottom-0 right-0 object-cover" />
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/20">
          <FileText className="text-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon" onClick={(e) => e.stopPropagation()}>
              <EllipsisVertical className="cursor-pointer text-gray-500 hover:text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
   <DropdownMenuItem
              onClick={() => toast.success("Share option clicked!")}
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setRenameModalOpen(true); }}>
              <Edit className="h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteForm} className="text-red-600">
              <Trash2 className="h-4 w-4" />
              <span>{loading ? "Deleting..." : "Delete"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col justify-center items-start gap-1 w-full">
        <h1 className="text-xl font-semibold break-words">{jsonForm?.formTitle}</h1>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="px-3 py-1 text-xs font-semibold rounded-xl bg-muted">{responseCount} Responses</div>
      </div>
      {renameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-3">Rename Form</h2>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={() => setRenameModalOpen(false)}>Cancel</Button>
              <Button onClick={updateFormTitle}>Save</Button>
            </div>
               {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-3">Are you sure you want to delete this form?</h2>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deleteForm}>Delete</Button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFormCard;
