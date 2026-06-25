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
import { useForgotPasswordMutation } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ForgotPassword from "@/assets/images/forgot_password.svg";
import MailSent from "@/assets/images/mail_sent.svg";

const Page = () => {
  const [email, setEmail] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const forgotPasswordMutation = useForgotPasswordMutation({
    options: {
      onSuccess: (data) => {
        console.log("Forgot Password request successful", data);
        setSuccessModal(true);
      },
      onError: (error) => {
        console.error("Forgot Password request failed", error);
        setErrorMessage(error.message);
        setErrorModal(true);
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      await forgotPasswordMutation.mutateAsync({ email: data.email });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
      setErrorModal(true);
    }
  };

  return (
    <div className="w-full  lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 shadow-lg z-10 bg-card">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to reset your password
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
              <Button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-800 text-white mt-4 "
              >
                Reset Password
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full "
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
          src={ForgotPassword}
          alt="Image"
          className="h-full w-full object-contain"
        />
      </div>
      {successModal && (
        <Modal onClose={() => setSuccessModal(false)}>
          <div className="p-10">
            <Image src={MailSent} alt="Image" className="h-28 object-contain" />
            <h2 className="text-3xl text-center mt-4">Check your Inbox!</h2>
            <p className=" text-center  mt-4 ">
              Instructions for resetting your password have been sent to your
              email.
            </p>
          </div>
        </Modal>
      )}
      {errorModal && (
        <Modal onClose={() => setErrorModal(false)}>
          <div className="p-10">
            <h2 className="text-3xl text-center">An Error has occured !</h2>
            <p className=" space-x-4 mt-4">{errorMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Page;
