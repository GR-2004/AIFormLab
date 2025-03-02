'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-5">
            {/* Animated Success Icon */}
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center bg-green-100 dark:bg-green-900 p-5 rounded-full"
            >
                <CheckCircle className="text-green-600 dark:text-green-400 w-16 h-16" />
            </motion.div>

            {/* Success Message */}
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-bold mt-5"
            >
                Form Submitted Successfully!
            </motion.h1>
            
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                Thank you for your response. You can return to the dashboard now.
            </p>

            {/* Back to Dashboard Button */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Button 
                    className="mt-6 px-6 py-3 text-lg font-medium"
                    onClick={() => router.push("/dashboard")}
                >
                    Go Back to Dashboard
                </Button>
            </motion.div>
        </div>
    );
}
