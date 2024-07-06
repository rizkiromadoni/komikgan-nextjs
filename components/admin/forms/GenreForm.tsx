"use client";

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "./FormInput";
import AdminAlertDialog from "../AdminAlertDialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(225),
});

const GenreForm = ({
  open,
  value,
  onSumbit,
  onClose,
}: {
  open: boolean;
  value?: { id: number | null; name: string };
  onSumbit: (id: number | null, data: z.infer<typeof formSchema>) => void;
  onClose: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  return (
    <Form {...form}>
      <AdminAlertDialog
        open={open}
        onOpenChange={onClose}
        title={value ? "Edit genre" : "New genre"}
        onSubmit={() => onSumbit(value?.id || null, form.getValues())}
      >
        <form
          onSubmit={form.handleSubmit((data) => {
            onSumbit(value?.id || null, data)
            form.resetField("name")
          })}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInput field={field} defaultValue={value?.name} label="Name" autoFocus />
            )}
          />
        </form>
      </AdminAlertDialog>
    </Form>
  );
};

export default GenreForm;
