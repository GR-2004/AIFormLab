"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../config";
import { JsonForms } from "../../../config/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import FormUi from "../../my-forms/edit-form/_components/FormUi";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";

const LiveAiForm = ({ params }) => {
  const [record, setRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    params && GetFormData();
  }, [params]);

  const GetFormData = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.id, Number(params?.formId)));
      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 md:p-6 max-w-3xl mx-auto min-h-screen"
      style={{
        background: record?.background,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 items-center">
            {record && (
              <FormUi
                jsonForm={jsonForm}
                selectedStyle={JSON.parse(record?.style)}
                selectedTheme={record?.theme}
                editable={false}
                formId={record?.id}
                enabledSignIn={record?.enabledSignIn}
              />
            )}

            <Link
              href={"/"}
              className="flex gap-2 items-center bg-muted/20 border p-2 rounded-badge "
            >
              <Image
                src={"/logo-icon.svg"}
                alt="logo"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="flex flex-col w-full">
                <span className="text-lg font-bold">Formify</span>
                <span className="text-sm text-muted-foreground">
                  Build your AI Form
                </span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveAiForm;
