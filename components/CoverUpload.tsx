"use client"

import { toBase64 } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Input } from "./ui/input";

type CoverUploadProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

const CoverUpload = ({ value, onChange }: CoverUploadProps) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = (await toBase64(file)) as string;
      onChange?.(base64);
    }
  };

  return (
    <>
      <Image
        alt="Product image"
        className="aspect-square w-full rounded-md object-cover"
        height="300"
        src={value ?? "/no-avatar.jpg"}
        width="300"
      />
      <Input type="file" accept="image/*" onChange={handleChange} />
    </>
  );
};

export default CoverUpload;
