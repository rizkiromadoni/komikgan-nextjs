"use client";

import React, { HTMLInputTypeAttribute } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  className?: string;
  field?: ControllerRenderProps<any>;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
};

const FormInput: React.FC<Props> = ({
  className,
  field,
  placeholder,
  type,
  label,
}) => {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input className={className} type={type} placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormInput;
