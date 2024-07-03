"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    title: string
}

const FormAction: React.FC<Props> = ({ title }) => {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => router.back()}
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {title}
      </h1>
      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          type="button"
        >
          Discard
        </Button>
        <Button size="sm" type="submit">
          Save Post
        </Button>
      </div>
    </div>
  );
};

export default FormAction;
