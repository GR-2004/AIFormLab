"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { db } from "../../config";
import { JsonForms } from "../../config/schema";
import { desc, eq } from "drizzle-orm";
import { Activity, FileText, Loader, Search, UsersRound } from "lucide-react";
import FormListItemResp from "./_components/FormListItemResp";
import Image from "next/image";
import MyFormCard from "../_components/MyFormCard";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const ResponsesPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
   const [filteredForms, setFilteredForms] = useState([]);
  const [activeForms, setActiveForms] = useState(0);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));
      setFormList(result);
      setTotalForms(result.length);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredForms(formList);
    return;
  }

  const filtered = formList.filter((form) => {
    const formTitle = JSON.parse(form.jsonform)?.formTitle || "";
    return formTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  setFilteredForms(filtered);
}, [searchQuery, formList]);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left Section: Heading & Description */}
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-3xl">Responses</h2>
          <p className="text-gray-600 text-sm">
            View and manage your responses.
          </p>
        </div>

        {/* Right Section: Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            placeholder='Search Templates e.g. "Cricket form"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      ) : formList.length === 0 ? (
        <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-3 ">
          <img src="/empty.gif" alt="Illustration" className="w-64 h-64 mb-4" />
          <p className="font-semibold text-lg text-gray-900">No Responses</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-24">
            <div className="flex p-4 gap-3 border rounded-xl w-full">
              <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/20">
                <FileText />
              </div>
              <div>
                <p className="text-sm font-medium break-words text-muted-foreground">
                  Total forms
                </p>
                <h1 className="text-xl font-semibold break-words">
                  {totalForms}
                </h1>
              </div>
            </div>
            <div className="flex p-4 gap-3 border rounded-xl w-full">
              <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/20">
                <UsersRound />
              </div>
              <div>
                <p className="text-sm font-medium break-words text-muted-foreground">
                  Total Responses
                </p>
                <h1 className="text-xl font-semibold break-words">
                  {totalResponses}
                </h1>
              </div>
            </div>
            <div className="flex p-4 gap-3 border rounded-xl w-full">
              <div className="flex justify-center items-center rounded-xl p-3 bg-[#00bba7]/20">
                <Activity />
              </div>
              <div>
                <p className="text-sm font-medium break-words text-muted-foreground">
                  Active Forms
                </p>
                <h1 className="text-xl font-semibold break-words">240</h1>
              </div>
            </div>
          </div>
          <div className="my-5 grid grid-cols-2 gap-5 lg:grid-cols-4 ">
            {filteredForms.map((form, index) => (
              // <FormListItemResp
              //   key={index}
              //   formRecord={form}
              //   jsonForm={JSON.parse(form.jsonform)}
              // />
              <MyFormCard
                key={index}
                formRecord={form}
                jsonForm={JSON.parse(form.jsonform)}
                onClick={() => router.push(`/responses/form/${form.id}`)}
                setTotalResponses={(value) => setTotalResponses(value)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResponsesPage;
