"use client";

import { RegisterUserSchema } from "@/server/api/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { useRegisterUser } from "@/services/users/mutations";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  repeatPassword: z.string().min(6).max(20)
}).superRefine(({ password, repeatPassword }, ctx) => {
  if (password !== repeatPassword) {
      ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["repeatPassword"]
      })
  }
})

const RegisterForm = () => {
  const registerUser = useRegisterUser()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    registerUser.mutate({json: {
      username: data.username,
      email: data.email,
      password: data.password
    }}, {
      onSuccess: () => {
        toast.success("User registered. Please login")
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-4 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="px-3 py-2 bg-[#2f303e] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                  placeholder="Username..."
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-white" />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  className="px-3 py-2 bg-[#2f303e] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                  placeholder="Email..."
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-white" />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  className="px-3 py-2 bg-[#2f303e] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                  placeholder="Password..."
                />
              </FormControl>
              <FormMessage className="text-white" />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  className="px-3 py-2 bg-[#2f303e] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                  placeholder="Repeat Password..."
                />
              </FormControl>
              <FormMessage className="text-white" />
            </>
          )}
        />
        <button
          className="px-5 py-2 bg-[#6e6dfb] text-white rounded-sm font-semibold disabled:cursor-not-allowed disabled:bg-[#2f303e] disabled:text-[#aaaaaa]"
          type="submit"
          disabled={loading}
        >
          REGISTER
        </button>
      </form>
    </Form>
  );
};

export default RegisterForm;
