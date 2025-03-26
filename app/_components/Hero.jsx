import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import TemplateCard from "./TemplateCard";

const Hero = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={"/logo-icon.svg"} alt="logo" width={64} height={64} />
        <h1 className="text-5xl font-semibold max-w-xl text-center">
          Create a form with
          <span className="text-primary"> Formify</span> in Minutes
        </h1>
      </div>
      <div className="max-w-2xl w-full">
        <div className="bg-primary px-1 pb-1 pt-4 rounded-2xl">
          <div className="p-4 rounded-xl bg-background">
            <input
              type="text"
              placeholder="Enter the prompt ex. Create a School Registration form"
              className="w-full border-none outline-none pb-6"
            />
            <div className="w-full flex justify-end">
              <Button>Generate form</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full">
        <div className="py-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-semibold">
              Recently created Templates
            </h1>
            <Button variant="outline" className="border-none">
              View More
            </Button>
          </div>
          <div className="flex justify-between items-center">
            {[...Array(3)].map((_, index) => (
              <TemplateCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
