"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSerie } from "@/services/series/mutations";
import { useGetSingleSeries } from "@/services/series/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostStatus, Status, Type } from "@prisma/client";
import { ChevronLeft, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EditSeriesForm from "@/components/admin/series/EditSeriesForm";

const EditSeriesPage = ({ params }: { params: {id: number} }) => {
  const { data, isLoading } = useGetSingleSeries({ id: params.id })

  if (isLoading) return <p>Please wait...</p>

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {data && (
        <EditSeriesForm data={data} />
      )}
    </main>
  );
};

export default EditSeriesPage;
