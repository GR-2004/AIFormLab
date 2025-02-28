'use client';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { BarChart, Layers, LibraryBig, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { db } from "../../../config";
import { JsonForms } from "../../../config/schema";

const SideNav = () => {

    const menuList = [
        {
            id: 1,
            name: "My Forms",
            icon: LibraryBig,
            path: "/dashboard",
        },

        {
            id: 2,
            name: "Responses",
            icon: MessageSquare,
            path: "/dashboard/responses",
        },

        {
            id: 3,
            name: "Analytics",
            icon: BarChart,
            path: "/dashboard/analytics"
        },

        {
            id: 4,
            name: "Templates",
            icon: Layers,
            path: "/dashboard/templates"
        },

        // {
        //     id: 5,
        //     name: "Upgrade",
        //     icon: Shield,
        //     path: "/dashboard/upgrade",
        // },
    ];

    const { user } = useUser();
    const [formList, setFormList] = useState();
    const [PercFileCreated, setPercFileCreated] = useState(0);

    const path = usePathname();
    useEffect(() => {
        user && GetFormList();
    }, [user]);


    const GetFormList = async () => {
        try {
            if (!user?.primaryEmailAddress?.emailAddress) {
                throw new Error("User email is missing. Please log in again.");
            }
    
            const result = await db.select().from(JsonForms)
                .where(eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress))
                .orderBy(desc(JsonForms.id));
    
            if (!result || result.length === 0) {
                console.warn("No forms found for the user.");
                setFormList([]);
                setPercFileCreated(0);
                return;
            }
    
            setFormList(result);
    
            // Avoid division by zero
            const perc = (result.length / 10) * 100;
            setPercFileCreated(perc);
    
        } catch (error) {
            console.error("Error fetching form list:", error);
            toast.error("Failed to fetch forms. Please try again.");
        }
    };    


    return (
        <div className="h-screen shadow-md border">
            {/* Tabs */}
            <div className="p-5">
                {menuList.map((menu, index) => {
                    return (
                        <Link
                            href={menu.path}
                            key={index}
                            className={`text-sm  font-semibold flex items-center gap-3 px-4 py-2 mb-2 hover:bg-primary 
            hover:text-white rounded-lg 
            cursor-pointer text-gray-500
            ${path == menu.path && "bg-primary text-white"}
            `}
                        >
                            <menu.icon />
                            {menu.name}
                        </Link>
                    );
                })}
            </div>

            {/* Create new Button and Progress */}
            {/* <div className="fixed bottom-7 p-6 w-64">
                <Button className="w-full">+ Create Form</Button>

                <div className="my-5">
                    <Progress value={PercFileCreated} />
                    <h2 className="text-sm mt-2 text-gray-600">
                        <strong>{formList?.length} </strong>Out of <strong>10 </strong>File Created
                    </h2>

                    <h2 className="text-sm mt-3 text-gray-600">
                        Upgrade your Plan for unlimited AI Form
                    </h2>
                </div>
            </div> */}
        </div>
    );
};

export default SideNav;