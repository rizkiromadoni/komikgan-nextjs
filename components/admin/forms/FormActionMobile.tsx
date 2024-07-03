"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FormActionMobile = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center gap-2 md:hidden">
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
  );
};

export default FormActionMobile;
