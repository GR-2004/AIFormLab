import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-8">
        <div className="w-full inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-3xl font-semibold break-words">My Forms</h1>
          <p className="text-base font-medium break-words text-muted-foreground">
            Recently created forms
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Button>
            Create Form <Plus />
          </Button>
          <Button variant="outline">View Templates</Button>
        </div>
      </div>
      <FormList />
    </div>
  );
}
