'use client';
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { db } from "../../config";
import { JsonForms } from "../../config/schema";
import { desc, eq } from "drizzle-orm";
import { Loader } from "lucide-react";
import FormListItemResp from "./_components/FormListItemResp";

const ResponsesPage = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [formList, setFormList] = useState([]);

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
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className='p-6'>
            <h2 className='font-bold text-3xl'>
                Responses
            </h2>
            {loading ? (
                <div className='flex justify-center items-center'>
                    <Loader className="h-6 w-6 animate-spin" />
                </div>
            ) : formList.length === 0 ? (
                <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-3 ">
                    <img src="/empty.gif" alt="Illustration" className="w-64 h-64 mb-4" />
                    <p className="font-semibold text-lg text-gray-900">No Responses</p>
                </div>
            ) : <div className='my-5 grid grid-cols-2 gap-5 lg:grid-cols-3 '>
                {formList.map((form, index) => (
                    <FormListItemResp
                        key={index}
                        formRecord={form}
                        jsonForm={JSON.parse(form.jsonform)}
                    />
                ))}
            </div>
            }
        </div>
    );
}

export default ResponsesPage