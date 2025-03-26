import { Button } from "@/components/ui/button";
import React from "react";

const TemplateCard = () => {
  return (
    <div className="p-5 border rounded-xl flex flex-col gap-4 relative overflow-hidden w-full flex-1 min-w-[250px]">
        <img src="./Vector.svg" className="absolute top-0 right-[-2px]" />
      <img className="aspect-video" src="https://picsum.photos/400/400 " />
      <div className="flex gap-2 items-center">
        <img className="w-10 h-10 rounded-full" src="https://picsum.photos/50/50" />
        <div className="flex flex-col">
          <h1 className="text-base break-words font-semibold">Template Name</h1>
          <p className="text-muted-foreground text-sm font-medium break-words">Ganesh rana</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button>Use Template</Button>
        <Button variant="outline">Preview</Button>
      </div>
    </div>
  );
};

export default TemplateCard;
