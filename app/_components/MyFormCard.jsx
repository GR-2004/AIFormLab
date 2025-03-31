"use client";
import React, { useEffect, useState } from "react";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { Edit, EllipsisVertical, FileText, Share, Trash } from "lucide-react";
import { JsonForms, userResponses } from "@/config/schema";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";

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
  const [alertOpen, setAlertOpen] = useState(false);

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

  const handleShareSuccess = () => {
    toast.success("Shared successfully!");
  };

  return (
    <div
      className="border rounded-lg overflow-hidden flex flex-col items-center gap-4 p-5 bg-background w-full h-full min-h-[220px] hover:bg-muted/20 cursor-pointer transition-all relative group"
      onClick={handleCardClick}
    >
      <img
        src={"./formCard-bg.svg"}
        alt={"bg-image"}
        className="absolute bottom-0 right-0 object-cover opacity-60 hover:opacity-100 transition-opacity"
      />

      {/* Top Section */}
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center rounded-xl p-3 bg-primary/20">
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
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
            className="w-56 p-1"
          >
            <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-muted focus:bg-muted rounded-md">
              <RWebShare
                data={{
                  text:
                    jsonForm?.formHeading +
                    " Build your form in seconds using AI Builder",
                  url:
                    process.env.NEXT_PUBLIC_BASE_URL +
                    "/aiform/" +
                    formRecord?.id,
                  title: jsonForm?.formTitle || "Share Form",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onShareWindowClose={handleShareSuccess}
              >
                <div className="flex items-center w-full">
                  <Share className="h-4 w-4 mr-5 text-muted-foreground" />
                  <span className="font-medium">Share</span>
                </div>
              </RWebShare>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Rename option clicked!");
              }}
              className="flex items-center p-2 cursor-pointer hover:bg-muted focus:bg-muted rounded-md"
            >
              <Edit className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="font-medium">Rename</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAlertOpen(true);
              }}
              className="flex items-center p-2 cursor-pointer hover:bg-muted focus:bg-muted rounded-md"
            >
              <Trash className="h-4 w-4 mr-3 text-red-500" />
              <span className="font-medium text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title & Heading */}
      <div className="flex flex-col items-start gap-1 w-full">
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

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              This action cannot be undone. This will permanently delete your
              form and remove responses from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
                setAlertOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                deleteForm();
                setAlertOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyFormCard;
