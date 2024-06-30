"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormMessage } from "../ui/form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)

    const memek = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (memek?.error) {
      toast.error("Username or password is incorrect")
      setLoading(false)
      return
    }

    toast.success("Login success")
    router.push("/")
    setLoading(false)
  };

  return (
    <Form {...form}>
      <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormControl>
                <input
                  {...field}
                  type="password"
                  className="px-3 py-2 bg-[#2f303e] text-[#aaaaaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                  placeholder="Password..."
                />
              </FormControl>
              <FormMessage />
            </>
          )}
        />
        <button
          className="px-5 py-2 bg-[#6e6dfb] text-white rounded-sm font-semibold"
          type="submit"
        >
          LOGIN
        </button>
      </form>
    </Form>
  );
};

export default LoginForm;
