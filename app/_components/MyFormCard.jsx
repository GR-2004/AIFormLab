"use client";
import React, { useEffect, useState } from "react";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { RWebShare } from "react-web-share";
import { EllipsisVertical, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { JsonForms, userResponses } from "@/config/schema";

const MyFormCard = ({
  jsonForm,
  formRecord,
  refreshData,
  onClick,
  setTotalResponses,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

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
  return (
    <div
      className="border rounded-lg overflow-hidden flex flex-col justify-between items-center gap-4 p-5 bg-background w-full min-h-[220px] shadow-md hover:shadow-lg cursor-pointer transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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
        {isHovered && (
          <EllipsisVertical className="transition-opacity duration-300 opacity-100" />
        )}
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
