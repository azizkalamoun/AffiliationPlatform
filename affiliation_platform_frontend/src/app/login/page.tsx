"use client";
import Modal from "@/components/ui/modal";
import Login from "@/assets/images/login.svg";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("accessToken", res.accessToken);
      setCookie(
        "authTokens",
        JSON.stringify({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
        {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
          sameSite: "strict",
        }
      );
      router.push(`/${res.role}/dashboard`);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
      setShowErrorModal(true);
    }
  };
  const loginMutation = useLoginMutation({});

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center h-full py-12 px-8 bg-card shadow-lg">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Log in to continue.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="text-sm">Show Password</label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-800 text-white"
              >
                Login
              </Button>
              <div className="grid gap-2 text-center text-sm">
                <Link href="/forgot-password" className="underline text-center">
                  Forgot your password?
                </Link>
                <div className="mt-2 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden lg:block border-l p-20">
        <Image
          src={Login}
          alt="Image"
          className="h-full w-full object-contain"
        />
      </div>
      {showErrorModal && (
        <Modal onClose={() => setShowErrorModal(false)}>
          <div className="text-center p-10">
            <h2 className="text-lg font-semibold mb-2">Ooops...</h2>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;
