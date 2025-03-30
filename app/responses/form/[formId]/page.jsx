"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { userResponses } from "@/config/schema";
import { eq } from "drizzle-orm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowLeft, Download, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import EmptyStatePlaceholder from "app/_components/EmptyState";

const FormAnalysisPage = ({ params }) => {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result = await db
          .select()
          .from(userResponses)
          .where(eq(userResponses.formRef, params?.formId))
          .orderBy(userResponses.createdAt);

        setResponses(result);

        // Group responses by date
        const groupedData = result.reduce((acc, response) => {
          const date = new Date(response.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format for Recharts
        const formattedChartData = Object.keys(groupedData).map((date) => ({
          date,
          responses: groupedData[date],
        }));

        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [params?.formId]);

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen">
      <div className="inline-flex flex-col justify-start items-start gap-3">
        <div
          className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-muted-foreground/200"
          onClick={() => router.push("/responses")}
        >
          <ArrowLeft />
          <span className="text-sm font-medium break-words">
            Back to Responses
          </span>
        </div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-6 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Cricket Registration Form
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Register for the cricket tournament
            </p>
          </div>
          <Button className="w-full md:w-auto flex items-center gap-2">
            <Download />
            Export Response
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading responses...</p>
      ) : responses.length === 0 ? (
        <EmptyStatePlaceholder
          title={"No Responses Found"}
          description={
            "Please share this form to users to get their responses."
          }
        />
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {/* Dynamically adding table headers for each parsedResponse key */}
                  {responses.length > 0 &&
                    Object.keys(
                      JSON.parse(responses[0].jsonResponse || "{}")
                    ).map((key) => (
                      <th key={key} className="px-4 py-2 border">
                        {key}
                      </th>
                    ))}
                  <th className="px-4 py-2 border">Created By</th>
                  <th className="px-4 py-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => {
                  let parsedResponse;
                  try {
                    parsedResponse = JSON.parse(response.jsonResponse);
                  } catch (error) {
                    parsedResponse = {};
                  }

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {/* Dynamically adding table cells for each parsedResponse value */}
                      {Object.entries(parsedResponse).map(([key, value]) => (
                        <td
                          key={key}
                          className="px-4 py-2 border text-gray-800 dark:text-gray-300 truncate max-w-xs cursor-pointer"
                          onDoubleClick={() => setModalData(value)}
                        >
                          {Array.isArray(value)
                            ? value
                                .map((item) =>
                                  typeof item === "object" && item.label
                                    ? item.label
                                    : item
                                )
                                .join(", ")
                            : typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : value.toString()}
                        </td>
                      ))}
                      <td className="px-4 py-2 border text-gray-800 dark:text-gray-300">
                        {response.createdBy}
                      </td>
                      <td className="px-4 py-2 border text-gray-800 dark:text-gray-300">
                        {new Date(response.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h1 className="text-2xl font-semibold w-full">Responses Overtime</h1>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#8884d8" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="responses" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Modal for expanded data */}
          {modalData && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setModalData(null)}
            >
              <div
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold mb-4">Full Data</h2>
                <pre className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                  {typeof modalData === "object"
                    ? JSON.stringify(modalData, null, 2)
                    : modalData}
                </pre>
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setModalData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormAnalysisPage;
