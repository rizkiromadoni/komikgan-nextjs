"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

const updateUserProfile = async (data: { username?: string, email?: string, password?: string }) => {
  const res = await api.profile.$patch({
    json: {
      username: data.username,
      email: data.email,
      password: data.password,
    }
  })
}

const UpdateProfileForm = ({ data }: { data: any }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: data.username || "",
      email: data.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateUserProfile,
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password && (values.password !== values.confirmPassword)) {
        toast.error("Passwords do not match")
        return
    }

    mutation.mutate({
      username: values.username,
      email: values.email,
      password: values.password
    }, {
        onSuccess: () => {
          toast.success("Profile updated successfully.")
        },
        onError: () => {
          toast.error("Failed to update profile.")
        }
    })
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <>
              <FormLabel className="font-semibold text-base text-[#9ca9b9]">
                Username
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  className="px-3 py-2 bg-[#45475a] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b] w-full"
                  placeholder="Username..."
                />
              </FormControl>
              <FormMessage />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <>
              <FormLabel className="font-semibold text-base text-[#9ca9b9]">
                Email
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  className="px-3 py-2 bg-[#45475a] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b] w-full"
                  placeholder="Email..."
                />
              </FormControl>
              <FormMessage />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <>
              <FormLabel className="font-semibold text-base text-[#9ca9b9]">
                Password
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  className="px-3 py-2 bg-[#45475a] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b] w-full"
                  placeholder="Password..."
                />
              </FormControl>
              <FormMessage />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <>
              <FormLabel className="font-semibold text-base text-[#9ca9b9]">
                Confirm Password
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  className="px-3 py-2 bg-[#45475a] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b] w-full"
                  placeholder="Confirm Password..."
                />
              </FormControl>
              <FormMessage />
            </>
          )}
        />
        <button
          className="bg-[#6e6dfb] text-white px-6 py-2 rounded-md w-full font-semibold"
          type="submit"
        >
          UPDATE
        </button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
