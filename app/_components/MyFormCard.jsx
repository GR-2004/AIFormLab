"use client";
import React, { useEffect, useState } from "react";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { RWebShare } from "react-web-share";
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

const MyFormCard = ({
  jsonForm,
  formRecord,
  refreshData,
  setTotalResponses,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    setLoading(true);
    try {
      const result = await db
        .delete(JsonForms)
        .where(
          and(
            eq(JsonForms.id, formRecord.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      if (result === 0) {
        setLoading(false);
        toast.error("Failed to delete the form. Please try again.");
        return;
      }
      setLoading(false);
      toast.success("Form Deleted Successfully!");
      refreshData();
    } catch (error) {
      console.error("Error deleting form:", error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleCardClick = () => {
    if (activeDropdown !== formRecord.id) {
      router.push(`/my-forms/edit-form/${formRecord.id}`);
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden flex flex-col justify-between items-center gap-4 p-5 bg-white w-full min-h-[220px] shadow-md hover:shadow-lg cursor-pointer transition-all relative group"
      onClick={handleCardClick}
    >
      <img
        src={"./formCard-bg.svg"}
        alt={"bg-image"}
        className="absolute bottom-0 right-0 object-cover"
      />
      
      {/* Top Section */}
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/20">
          <FileText className="text-primary" />
        </div>

        {/* Ellipsis Icon - Visible Only on Hover */}
        <DropdownMenu
          open={activeDropdown === formRecord.id}
          onOpenChange={(isOpen) =>
            setActiveDropdown(isOpen ? formRecord.id : null)
          }
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="icon"
              onClick={(e) => e.stopPropagation()}
              className={`transition-opacity focus:ring-0 ${
                activeDropdown === formRecord.id
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <EllipsisVertical className="cursor-pointer text-gray-500 hover:text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={() => toast.success("Share option clicked!")}
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success("Rename option clicked!")}
            >
              <Edit className="h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={deleteForm}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title & Heading */}
      <div className="flex flex-col justify-center items-start gap-1 w-full">
        <h1 className="text-xl font-semibold break-words">
          {jsonForm?.formTitle}
        </h1>
        <p className="text-muted-foreground text-sm font-medium overflow-hidden text-ellipsis line-clamp-2">
          {jsonForm?.formHeading}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex justify-between items-center">
        <div className="px-3 py-1 text-xs font-semibold rounded-xl bg-muted">
          {responseCount} Responses
        </div>
      </div>
    </div>
  );
};

export default MyFormCard;
