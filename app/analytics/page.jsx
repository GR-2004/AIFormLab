"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { JsonForms } from "@/config/schema";
import { db } from "@/config";
import { desc, eq } from "drizzle-orm";
import FormListItemResp from "./_components/FormListitemResp";

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalForms, setTotalForms] = useState(0);

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
      console.log("ganesh", result);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  const isDark = theme === "dark";

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>
          Welcome back!
        </h1>
        <p className="text-zinc-500">Here's an overview of your forms</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Total Forms", value: totalForms },
          { label: "Total Responses", value: totalResponses },
        ].map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border ${isDark
                ? "bg-zinc-900 border-zinc-800 text-white"
                : "bg-white border-gray-200 text-black"
              }`}
          >
            <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Forms Section */}
      <div
        className={`rounded-xl p-6 border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          }`}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Forms</h2>
        <div className="space-y-4">
            {formList?.map((form, index) => (
              <FormListItemResp
                  key={index}
                  formRecord={form}
                  jsonForm={JSON.parse(form.jsonform)}
                  setTotalResponses={(value) => setTotalResponses(value)}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
