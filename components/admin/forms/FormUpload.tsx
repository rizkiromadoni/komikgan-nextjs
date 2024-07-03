"use client";

import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toBase64 } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  value?: string;
  onChange?: (value?: string) => void;
};

const FormUpload: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = (await toBase64(file)) as string;
      onChange?.(base64);
    }
  };

  return (
    <FormItem>
      <Image
        alt=""
        className="aspect-square w-full rounded-md object-cover"
        height="300"
        src={value ?? "/no-image.jpg"}
        width="300"
      />
      <FormControl>
        <Input type="file" accept="image/*" onChange={handleChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormUpload;
