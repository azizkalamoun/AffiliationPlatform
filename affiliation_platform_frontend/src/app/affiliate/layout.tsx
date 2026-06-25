"use client";
import { BarChart, Home, Wallet } from "lucide-react";
import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Modal from "@/components/ui/modal";
import { countries } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  IconTriangleFilled,
  IconSpeakerphone,
  IconMenu2,
  IconX,
  IconSearch,
  IconUserCircle,
  IconBell,
  IconDashboard,
} from "@tabler/icons-react";
import { getActiveUserIdFromTokens } from "@/utils/auth";
import { User } from "@/types/user";
import { fetchUserById } from "@/services/affiliateUrl";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { useUpdateUserMutation } from "@/services/user";
import { useCreateFeedbackMutation } from "@/services/feedback";
import { Select } from "@/components/ui/select";

const editFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  occupation: z.string().min(2).max(50),
  age: z.string().min(2).max(50),
  gender: z.string().min(2).max(50),
  phoneNumber: z.number().min(8).max(8),
  country: z.string(),
});

const feedbackFormSchema = z.object({
  subject: z.string().min(2).max(50),
  object: z.string().min(15).max(500),
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
  const updateUserMutation = useUpdateUserMutation({ options: {} });
  const createFeedbackMutation = useCreateFeedbackMutation({ options: {} });
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [SuccessShowModal, setSuccessShowModal] = useState(false);

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

  const Signout = () => {
    console.log("Signout");
    localStorage.removeItem("accessToken");
    deleteCookie("authTokens");
    router.push("/login");
  };

  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
    if (activeUser)
      editForm.reset({
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
  const handleFeedback = () => {
    setFeedbackModalOpen(true);
  };

  const handleModalClose = () => {
    setEditProfileModalOpen(false);
    setFeedbackModalOpen(false);
  };
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
  });
  const feedbackForm = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
  });
  const onEditFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const updatedUserResponse = await updateUserMutation.mutateAsync({
        ...editForm.getValues(),
        id: activeUser?.id ?? "0",
      });
      fetchUser(activeUser?.id ?? "0");
      handleModalClose();
      setSuccessShowModal(true);
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
    }
  };

  const onFeedbackFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const createdFeedbackResponse = await createFeedbackMutation.mutateAsync({
        ...feedbackForm.getValues(),
        userId: activeUser?.id ?? "0",
      });
      handleModalClose();
      setSuccessShowModal(true);
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
                className="flex items-center gap-2 font-bold text-lg"
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

            <div>
              <nav className="flex flex-col px-2  font-medium  lg:px-4 relative h-fit space-y-2">
                <Link
                  href="/affiliate/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2  -foreground  hover:text-primary font-semibold transition-all duration-300 ease-in-out hover:bg-background"
                >
                  <IconDashboard className=" h-5 w-5" />
                  Dashboard
                </Link>

                <div className="flex flex-col">
                  <button
                    onClick={() => setMarketingToolsOpen(!marketingToolsOpen)}
                    className="flex justify-start items-center gap-3 rounded-md px-3 py-2  -foreground   hover:text-primary focus:outline-none font-semibold transition-all duration-300 ease-in-out hover:bg-background"
                  >
                    <IconSpeakerphone width="20" />
                    Marketing Tools
                    <span className="absolute right-6">
                      <IconTriangleFilled
                        width="12"
                        height="8"
                        stroke-width="1.5"
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
                      href="/affiliate/mylinks/"
                      className="flex items-center text-sm gap-3 rounded-md px-3 py-2 -foreground transition-all hover:text-primary  duration-300 ease-in-out hover:bg-background"
                    >
                      My Links
                    </Link>
                    <Link
                      href="/affiliate/links/"
                      className="flex items-center text-sm gap-3 rounded-md px-3 py-2 -foreground  hover:text-primary transition-all duration-300 ease-in-out hover:bg-background"
                    >
                      Listed Links
                    </Link>

                    <Link
                      href="/affiliate/subscriptions"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm  text-primary transition-all duration-300 ease-in-out hover:bg-background hover:text-primary"
                    >
                      Subscriptions
                    </Link>
                  </div>
                </div>

                <Link
                  href="/affiliate/dashboard/"
                  className="flex items-center gap-3 rounded-md px-3 py-2   transition-all duration-300 ease-in-out hover:bg-background hover:text-primary font-semibold"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-2 ">
          <header className="flex h-14 items-center gap-4 border-b px-4 mr-6  ml-auto rounded-full lg:h-[60px]  bg-card shadow-lg">
            <div className="w-full flex-1">
              <form>
                <div className="relative ">
                  <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-sm text-primary" />
                  <Input
                    type="search"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full appearance-none bg-background pl-8 shadow-none"
                  />
                </div>
              </form>
            </div>
            <Button size="icon" className="ml-auto h-10 w-10">
              <IconBell className="h-4 w-4" />
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
                  {activeUser
                    ? `${activeUser.firstName} ${activeUser.lastName}`
                    : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditProfile}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFeedback}>
                  Support
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
            <Form {...editForm}>
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
                <div className="flex justify-center space-x-4 mt-4">
                  <Button type="button" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => onEditFormSubmit(e)}
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

      {feedbackModalOpen && (
        <Modal onClose={handleModalClose}>
          <Card className="md:w-96">
            <CardHeader>
              <CardTitle className="text-center">Support Form</CardTitle>
              <br />
              <CardDescription className=" mb-0">
                Contact us on (480) 632-2918 or fill our the form below to help
                us improve our services.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-0 pt-0">
              <Form {...feedbackForm}>
                <form>
                  <FormField
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your subject..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="object"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Object</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Enter your suggestions here..."
                            className="flex  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-48"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <span className="text-red-500">{errorMessage}</span>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button type="button" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={(e) => onFeedbackFormSubmit(e)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
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
                <p>Form Submitted Successfully!</p>

                <div className="flex justify-center space-x-4 mt-4">
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
