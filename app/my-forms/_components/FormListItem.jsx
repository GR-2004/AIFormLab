"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Edit, Share2, Trash } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../config";
import { JsonForms } from "../../../config/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { RWebShare } from "react-web-share";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

const FormListItem = ({ jsonForm, formRecord, refreshData }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      className="border rounded-lg overflow-hidden flex flex-col justify-between items-center gap-4 p-5 bg-white w-full min-h-[220px] shadow-md hover:shadow-lg cursor-pointer transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={"./formCard-bg.svg"}
        alt={"bg-image"}
        className="absolute bottom-0 right-0 object-cover"
      />
      {/* Top Section */}
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/40">
          <Image
            src={"/file-text.svg"}
            alt="file image"
            width={24}
            height={24}
          />
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
          21 Responses
        </div>
      </div>
    </div>
  );
};

export default FormListItem;

{
  /* <div className="flex justify-between">
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Trash className="h-5 w-5 text-red-500 cursor-pointer hover:scale-105 transition-all" />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900">
                  <AlertDialogHeader>
                      <AlertDialogTitle className="text-black dark:text-white">
                          Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          This action cannot be undone. This will permanently delete your form
                          and remove your data from our servers.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteForm()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div> 
 <h2 className="text-lg text-black dark:text-white">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-500 dark:text-gray-400">{jsonForm?.formTitle}</h2>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />
      <div className="flex justify-between">
          <RWebShare
              data={{
                  text: jsonForm?.formHeading + " Build your form in seconds using AI Builder",
                  url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + formRecord?.id,
                  title: jsonForm?.formTitle,
              }}
              disableNative={true}
              onClick={() => console.log("shared successfully!")}
          >
              <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-white"
              >
                  <Share2 className="h-5 w-5" /> Share
              </Button>
          </RWebShare>

          <Link href={`/my-forms/edit-form/${formRecord.id}`}>
              <Button size="sm" className="flex gap-2 dark:bg-gray-700 dark:text-white">
                  <Edit className="h-5 w-5" /> Edit
              </Button>
          </Link>
      </div> */
}
