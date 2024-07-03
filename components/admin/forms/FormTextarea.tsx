"use client";

import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  className?: string;
  field?: ControllerRenderProps<any>;
  placeholder?: string;
  label?: string;
};

const FormTextarea: React.FC<Props> = ({ className, field, placeholder, label }) => {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Textarea
          placeholder={placeholder}
          className={className}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormTextarea;
