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
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptyStatePlaceholder from "app/_components/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatHeaderName = (key) => {
  // Convert camelCase or snake_case to Title Case with spaces
  return (
    key
      // Split by uppercase letters, underscores, or hyphens
      .split(/(?=[A-Z])|_|-/)
      // Capitalize first letter of each word and join with spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
};

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

  const renderCell = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "object" && item.label ? item.label : item
        )
        .join(", ");
    }
    return typeof value === "object"
      ? JSON.stringify(value, null, 2)
      : value?.toString();
  };

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
          {/* Replace old table with shadcn Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  {responses.length > 0 &&
                    Object.keys(
                      JSON.parse(responses[0].jsonResponse || "{}")
                    ).map((key) => (
                      <TableHead
                        key={key}
                        className="border-r last:border-r-0 font-semibold"
                      >
                        {formatHeaderName(key)}
                      </TableHead>
                    ))}
                  <TableHead className="border-r font-semibold">
                    Created By
                  </TableHead>
                  <TableHead className="font-semibold">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response, index) => {
                  let parsedResponse;
                  try {
                    parsedResponse = JSON.parse(response.jsonResponse);
                  } catch (error) {
                    parsedResponse = {};
                  }

                  return (
                    <TableRow key={index} className="border-b">
                      {Object.entries(parsedResponse).map(([key, value]) => (
                        <TableCell
                          key={key}
                          className="max-w-[200px] truncate border-r"
                          onClick={() => setModalData(value)}
                        >
                          {renderCell(value)}
                        </TableCell>
                      ))}
                      <TableCell className="border-r">
                        {response.createdBy}
                      </TableCell>
                      <TableCell>
                        {new Date(response.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <h1 className="text-2xl font-semibold w-full">Responses Overtime</h1>

          {/* Chart */}
          <div className="bg-muted/40 p-4 rounded-lg shadow-md mt-6">
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

          {/* Update modal to use shadcn styling */}
          {modalData && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center"
              onClick={() => setModalData(null)}
            >
              <div
                className="bg-background p-6 rounded-lg shadow-lg max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold mb-4">Full Data</h2>
                <pre className="text-sm text-foreground/70 whitespace-pre-wrap bg-muted p-4 rounded-md">
                  {typeof modalData === "object"
                    ? JSON.stringify(modalData, null, 2)
                    : modalData}
                </pre>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => setModalData(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormAnalysisPage;
