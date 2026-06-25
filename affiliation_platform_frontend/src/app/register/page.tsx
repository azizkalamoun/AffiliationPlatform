"use client";
import MailBox from "@/assets/images/mailbox.svg";
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
import Modal from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { countries } from "@/constants";
import { useRegisterClick, useRegisterMutation } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const RegisterPage = ({ searchParams }: PageProps) => {
  console.log(searchParams);
  const ref = searchParams.ref ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    occupation: z.string().min(2).max(50),
    age: z.string().min(2).max(50),
    gender: z.string().min(2).max(50),
    phoneNumber: z.string().min(2).max(50),
    country: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const registerMutation = useRegisterMutation({
    options: {
      onSuccess: (data: any) => {
        console.log("Registration successful", data);
        setShowSuccessModal(true);
        form.reset();
      },
      onError: (error: any) => {
        console.error("Registration failed", error);
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);
          setShowErrorModal(true);
        }
      },
    },
  });

  useRegisterClick(ref as string);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        occupation: data.occupation,
        age: data.age,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        country: data.country,
        ref: ref as string,
        baseUrl: window ? window.location.origin : "",
      });
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <Card className="mx-auto w-fit my-6 px-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Sign Up</CardTitle>
        <CardDescription>
          Fill in your information to create an account !
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select {...field}>
                      <option value="Select a country" disabled selected>
                        Select a country
                      </option>
                      {countries.map((country) => (
                        <option key={country.short} value={country.long}>
                          {country.long}
                        </option>
                      ))}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="Select your gender" disabled selected>
                          Select your gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
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
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Phone Number"
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
              Create an account
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account ?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
      {/* Modal for success message */}
      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div className="text-center  p-10">
            <Image
              src={MailBox}
              alt="Image"
              className="h-32 object-contain mb-2"
            />
            <h2 className="text-lg font-semibold mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 max-w-96 mx-auto">
              Your account has been successfully added to the waiting list. You
              will be notified about the status of activation via E-mail.
            </p>
          </div>
        </Modal>
      )}
      {/* Modal for error message */}
      {showErrorModal && (
        <Modal onClose={() => setShowErrorModal(false)}>
          <div className="text-center p-10">
            <h2 className="text-lg font-semibold mb-2">Registration Error</h2>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        </Modal>
      )}
    </Card>
  );
};
export default RegisterPage;
