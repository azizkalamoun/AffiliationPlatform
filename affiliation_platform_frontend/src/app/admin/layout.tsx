"use client";
import { BarChart, Home, Wallet } from "lucide-react";
import Link from "next/link";
import React, { createContext, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { countries } from "@/constants";
import {
  fetchUserById,
  useFetchAllAffiliateUrlsQuery,
} from "@/services/affiliateUrl";
import { useFetchAllUsersQuery, useUpdateUserMutation } from "@/services/user";
import { User } from "@/types";
import { AffiliateUrl } from "@/types/affiliateUrl";
import { getActiveUserIdFromTokens } from "@/utils/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBell,
  IconMenu2,
  IconSearch,
  IconSpeakerphone,
  IconTriangleFilled,
  IconUserCircle,
  IconUsers,
  IconX,
  IconMailbox,
  IconDashboard,
} from "@tabler/icons-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select } from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  occupation: z.string().min(2).max(50),
  age: z.string().min(2).max(50),
  gender: z.string().min(2).max(50),
  phoneNumber: z.number().min(2).max(50),
  country: z.string(),
});

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [marketingToolsOpen, setMarketingToolsOpen] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const { data } = useFetchAllUsersQuery({});
  const { data: AffUrldata } = useFetchAllAffiliateUrlsQuery({}) as {
    data: AffiliateUrl[];
  };
  const updateUserMutation = useUpdateUserMutation({ options: {} });
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [SuccessShowModal, setSuccessShowModal] = useState(false);
  const [RegistrationRequestCount, setRegistrationRequestCount] = useState(0);
  const [PromotionRequestCount, setPromotionRequestCount] = useState(0);
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUser, setActiveUser] = useState<User | null>(null);

  useEffect(() => {
    if (data && data.data) {
      const count = data.data.filter(
        (user: User) => user.status === "waiting list"
      ).length;
      setRegistrationRequestCount(count);
    }
  }, [data]);

  useEffect(() => {
    if (AffUrldata && AffUrldata) {
      const count = AffUrldata.filter(
        (AffiliateUrl: AffiliateUrl) => AffiliateUrl.status === "pending"
      ).length;
      setPromotionRequestCount(count);
    }
  }, [AffUrldata]);

  const fetchUser = async (userId: string) => {
    try {
      const user = await fetchUserById(userId);
      setActiveUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const activeUserId = getActiveUserIdFromTokens();
    if (activeUserId) {
      fetchUser(activeUserId);
    }
  }, []);
  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
    if (activeUser)
      form.reset({
        firstName: activeUser.firstName,
        lastName: activeUser.lastName,
        occupation: activeUser.occupation,
        age: activeUser.age,
        gender: activeUser.gender,
        email: activeUser.email,
        phoneNumber: activeUser.phoneNumber,
        country: activeUser.country,
      });
  };
  const handleModalClose = () => {
    setEditProfileModalOpen(false);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const Signout = () => {
    console.log("Signout");
    localStorage.removeItem("accessToken");
    deleteCookie("authTokens");
    router.push("/login");
  };
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const updatedUserResponse = await updateUserMutation.mutateAsync({
        ...form.getValues(),
        id: activeUser?.id ?? "0",
      });
      fetchUser(activeUser?.id ?? "");
      handleModalClose();
      setSuccessShowModal(true);
      if (activeUser?.id) {
        const updatedUserResponse = await updateUserMutation.mutateAsync({
          ...form.getValues(),
          id: activeUser?.id,
        });
        fetchUser(activeUser?.id);
        handleModalClose();
        setSuccessShowModal(true);
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessShowModal(false);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div
        className={` min-h-screen w-full ${
          navbarOpen
            ? "grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
            : "block"
        } `}
      >
        {!navbarOpen && (
          <Button
            size="icon"
            className="fixed top-4 left-6 ml-auto h-10 w-10 bg-white"
            onClick={() => setNavbarOpen(true)}
          >
            <IconMenu2 />
          </Button>
        )}
        <div
          className={`  h-full w-72 bg-white border-r transform transition-transform duration-300 ease-in z-30 shadow-lg ${
            navbarOpen ? " translate-x-0" : "fixed -translate-x-full"
          }`}
        >
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:pl-6 lg:pr-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 font-bold text-xl"
              >
                Navigation Menu
              </Link>

              <Button
                size="icon"
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="ml-auto h-8 w-8"
              >
                <IconX className=" h-6 w-6" />
              </Button>
            </div>

            <nav className="flex flex-col px-2 font-medium  lg:px-4 relative h-fit space-y-2">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary font-semibold"
              >
                <IconDashboard className=" h-5 w-5" />
                Dashboard
              </Link>

              <div className="flex flex-col">
                <button
                  onClick={() => setMarketingToolsOpen(!marketingToolsOpen)}
                  className="flex justify-start items-center gap-3 rounded-md px-3 py-2  text-primary  transition-all duration-300 ease-in-out hover:bg-background hover:text-primary focus:outline-none font-semibold "
                >
                  <IconSpeakerphone width="20" />
                  Marketing Tools
                  <div
                    className={`w-2 h-2  bg-green-300 rounded-full align-middle inline-block ${
                      PromotionRequestCount != 0 ? "inline" : "hidden"
                    }`}
                  ></div>
                  <span className="absolute right-6 ">
                    <IconTriangleFilled
                      width="12"
                      height="8"
                      strokeWidth="1.5"
                      className={` transition-all inline-block duration-300 ease-in-out mr-2 align-middle  ${
                        marketingToolsOpen ? "rotate-0" : "rotate-180"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`pl-10 transition-max-height duration-700 ease-in-out overflow-hidden  ${
                    marketingToolsOpen ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <Link
                    href="/admin/links/"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-primary  transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Links
                  </Link>
                  <Link
                    href="/admin/banners/"
                    className="flex items-center gap-3 rounded-md px-3 py-2  text-primary  transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Banners
                  </Link>
                  <Link
                    href="/admin/subscriptions"
                    className="flex items-center gap-3 rounded-md px-3 py-2   text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Subscriptions
                  </Link>
                  <Link
                    href="/admin/promotion-requests/"
                    className="flex items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Promotion Requests
                    <Badge
                      className={`ml-auto z-50 h-5 w-2 shrink-2 items-center justify-center  ${
                        PromotionRequestCount == 0 ? "hidden" : "flex"
                      }`}
                    >
                      {PromotionRequestCount}
                    </Badge>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => setUserManagementOpen(!userManagementOpen)}
                  className="flex justify-start items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary focus:outline-none font-semibold"
                >
                  <IconUsers width="20" />
                  User Management
                  <div
                    className={`w-2 h-2  bg-green-300 rounded-full align-middle inline-block ${
                      RegistrationRequestCount != 0 ? "inline" : "hidden"
                    }`}
                  ></div>
                  <span className="absolute right-6">
                    <IconTriangleFilled
                      width="12"
                      height="8"
                      strokeWidth="1.5"
                      className={` transition-all inline-block duration-300 ease-in-out mr-2 align-middle ${
                        userManagementOpen ? "rotate-0" : "rotate-180"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`pl-10 transition-max-height duration-700 ease-in-out overflow-hidden  ${
                    userManagementOpen ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <Link
                    href="/admin/affiliates"
                    className="flex items-center gap-3 rounded-md px-3 py-2   text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Affiliates
                  </Link>
                  <Link
                    href="/admin/secretaries"
                    className="flex items-center gap-3 rounded-md px-3 py-2   text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Secretaries
                  </Link>
                  <Link
                    href="/admin/administrators"
                    className="flex items-center gap-3 rounded-md px-3 py-2   text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Administrators
                  </Link>

                  <Link
                    href="/admin/registration-requests/"
                    className="flex items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary text-sm"
                  >
                    Registration Requests
                    <Badge
                      className={`ml-auto z-50 h-5 w-2 shrink-2 items-center justify-center  ${
                        RegistrationRequestCount == 0 ? "hidden" : "flex"
                      }`}
                    >
                      {RegistrationRequestCount}
                    </Badge>
                  </Link>
                </div>
              </div>
              <Link
                href="/admin/feedbacks/"
                className="flex items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary font-semibold"
              >
                <IconMailbox width="20" />
                Feedbacks
              </Link>
              <Link
                href="/admin/dashboard/"
                className="flex items-center gap-3 rounded-md px-3 py-2  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary font-semibold"
              >
                <Wallet className="h-4 w-4" />
                Wallet
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col pt-2 ">
          <header className="flex h-14 items-center gap-4 border-b px-4 mr-6  ml-auto rounded-lg  bg-card shadow-lg">
            <div className="w-full flex-1 ">
              <form>
                <div className="relative ">
                  <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-sm text-primary" />
                  <Input
                    type="search"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full appearance-none bg-background pl-8 shadow-none outline-0 "
                  />
                </div>
              </form>
            </div>
            <Button size="icon" className="ml-auto h-10 w-10">
              <IconBell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="rounded-full">
                  {" "}
                  <IconUserCircle className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>
                  {" "}
                  {activeUser
                    ? `${activeUser.firstName} ${activeUser.lastName}`
                    : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditProfile}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => Signout()}>
                  Signout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      {editProfileModalOpen && (
        <Modal onClose={handleModalClose}>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
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
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>occupation</FormLabel>
                        <FormControl>
                          <Input placeholder="Occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>age</FormLabel>
                        <FormControl>
                          <Input placeholder="Age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>gender</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <option
                              value="Select your  gender"
                              disabled
                              selected
                            >
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
                  <FormField
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
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

                <span className="text-red-500">{errorMessage}</span>
                <div className="flex justify-between space-x-4 mt-4">
                  <Button type="button" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => onSubmit(e)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Modal>
      )}
      {SuccessShowModal && (
        <Modal onClose={handleSuccessModalClose}>
          <div className="container mx-auto flex items-center justify-center">
            <div className="mx-auto w-fit">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Changes Saved!</p>

                <div className="flex justify-between space-x-4 mt-4">
                  <Button onClick={handleSuccessModalClose}>Close</Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
    </SearchContext.Provider>
  );
}
export { SearchContext };
