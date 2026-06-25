"use client";

import { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFetchAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddMutation,
} from "@/services/user";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { User, addProps } from "@/types";
import { countries } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchContext } from "../layout";
import { Select } from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8).max(50),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  occupation: z.string().min(2).max(50),
  age: z.string().min(2).max(50),
  gender: z.string().min(2).max(50),
  phoneNumber: z.number().min(8).max(8),
  country: z.string(),
  role: z.string(),
  status: z.string(),
});

function AffiliatesPage() {
  const { data, refetch } = useFetchAllUsersQuery({});
  const updateUserMutation = useUpdateUserMutation({ options: {} });
  const deleteUserMutation = useDeleteUserMutation({ options: {} });
  const addMutation = useAddMutation({ options: {} });

  const [DeleteShowModal, setDeleteShowModal] = useState(false);
  const [ModifyShowModal, setModifyShowModal] = useState(false);
  const [AddShowModal, setShowAddModal] = useState(false);
  const [SuccessShowModal, setSuccessShowModal] = useState(false); // State for success modal
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUserId] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");

  const { searchQuery } = useContext(SearchContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
    setModifyShowModal(true);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      occupation: user.occupation,
      age: user.age,
      gender: user.gender,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      role: user.role,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(deletingUser);
      setDeleteShowModal(false);
      setDeletingUserId("");
      await refetch();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeleteShowModal(false);
    setDeletingUserId("");
  };

  const handleModalClose = () => {
    setModifyShowModal(false);
    setShowAddModal(false);
    setDeleteShowModal(false);
    setCurrentUser(null);
  };

  const handleSuccessModalClose = async () => {
    setSuccessShowModal(false);
    await refetch();
  };
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentUser) {
      try {
        const updatedUserResponse = await updateUserMutation.mutateAsync({
          ...form.getValues(),
          id: currentUser?.id ?? "0",
        });
        console.log("User updated successfully:", updatedUserResponse);
        handleModalClose();
        await refetch();
      } catch (error: any) {
        console.error("Error updating user:", error);
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      }
    } else {
      try {
        const formData = form.getValues();
        const addData: addProps = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          occupation: formData.occupation,
          age: formData.age,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          role: formData.role,
          status: "approved",
        };
        await addMutation.mutateAsync(addData);
        console.log("User added successfully");
        handleModalClose();
        setSuccessShowModal(true);
      } catch (error: any) {
        console.error("Error adding user:", error);
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      }
    }
  };
  const filteredData =
    data?.data.filter((user: User) =>
      `${user.firstName} ${user.lastName} ${user.email}  ${user.country}  ${user.occupation} ${user.gender}  ${user.age}`
        .toLowerCase()
        .match(searchQuery.toLowerCase())
    ) || [];

  return (
    <Card>
      <div className="flex flex-row justify-between items-center ">
        <CardHeader>
          <CardTitle>Affiliates</CardTitle>
          <CardDescription>A list of all affiliates.</CardDescription>{" "}
        </CardHeader>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 hover:bg-green-700 text-white m-6"
        >
          Add User
        </Button>
      </div>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>occupation</TableHead>
              <TableHead>age</TableHead>
              <TableHead>gender</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData
              .filter(
                (user: User) =>
                  user.role === "affiliate" && user.status === "approved"
              )
              .map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName}
                  </TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex flex-row ">
                    <button
                      onClick={() => handleUpdateUser(user)}
                      className="bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-normal py-2 px-4 rounded ml-2 "
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      {(ModifyShowModal || AddShowModal) && (
        <Modal onClose={handleModalClose}>
          <div className="container flex items-center justify-center">
            <div className="w-fit">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  {currentUser ? "Update User" : "Add User"}
                </CardTitle>
                <CardDescription>
                  {currentUser
                    ? "Update user information."
                    : "Fill in the information to add a new user."}
                </CardDescription>
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
                      />{" "}
                      <FormField
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Select {...field}>
                                <option
                                  value="Select a country"
                                  disabled
                                  selected
                                >
                                  Select a country
                                </option>
                                {countries.map((country) => (
                                  <option
                                    key={country.short}
                                    value={country.long}
                                  >
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
                    {!currentUser && (
                      <FormField
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
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
                    <FormField
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <option value="affiliate">Affiliate</option>
                              <option value="secretary">Secretary</option>
                            </Select>
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
                        onClick={(e) => onSubmit(e)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {currentUser ? "Update" : "Add"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
      {DeleteShowModal && (
        <Modal onClose={handleCancelDelete}>
          <div className="container mx-auto flex items-center justify-center">
            <div className="mx-auto w-fit">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Confirm Delete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-center space-x-4 mt-4 ">
                  <Button onClick={handleCancelDelete}>Cancel</Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600  text-white"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
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
                <p>
                  {" "}
                  {currentUser
                    ? "Successfully Updated."
                    : "Successfully Added."}
                </p>

                <div className="flex justify-center space-x-4 mt-4">
                  <Button onClick={handleSuccessModalClose}>Close</Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

export default AffiliatesPage;
