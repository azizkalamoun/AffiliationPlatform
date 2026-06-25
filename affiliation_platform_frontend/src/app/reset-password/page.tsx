"use client";
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
import Modal from "@/components/ui/modal";
import { resetPassword, useResetPasswordMutation } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ResetPassword from "@/assets/images/reset_password.svg";

const Page = () => {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const formSchema = z.object({
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const resetPasswordMutation = useResetPasswordMutation({
    options: {
      onSuccess: (data) => {
        console.log("Password reset successful", data);
        setSuccessModal(true);
      },
      onError: (error) => {
        console.error("Password reset failed", error);
        setErrorMessage(error.message);
        setErrorModal(true);
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    try {
      await resetPasswordMutation.mutateAsync({
        resetToken: resetToken || "",
        newPassword: data.newPassword,
      });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
      setErrorModal(true);
    }
  };

  return (
    <div className="w-full  lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
      <div className="flex items-center justify-center py-12 shadow-lg bg-card">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your new password below
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-800 text-white"
              >
                Reset Password
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden lg:block border-l p-20">
        <Image
          src={ResetPassword}
          alt="Image"
          className="h-full w-full object-contain"
        />
      </div>
      {successModal && (
        <Modal onClose={() => setSuccessModal(false)}>
          <div className="p-10">
            <h2>Password Reset</h2>
            <p>Your password has been successfully reset.</p>
          </div>
        </Modal>
      )}
      {errorModal && (
        <Modal onClose={() => setErrorModal(false)}>
          <div className="p-10">
            <h2>Error</h2>
            <p>{errorMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Page;
