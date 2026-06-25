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
  useFetchAllUrlsQuery,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
  useCreateUrlMutation,
} from "@/services/url";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Url } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { SearchContext } from "../layout";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid url" }),
  CompanyName: z.string().min(1, { message: "Company Name is required" }),
  Description: z.string().min(1, { message: "Description is required" }),
});

function UrlsPage() {
  const { data, refetch } = useFetchAllUrlsQuery({});
  const updateUrlMutation = useUpdateUrlMutation({ options: {} });
  const deleteUrlMutation = useDeleteUrlMutation({ options: {} });
  const createUrlMutation = useCreateUrlMutation({ options: {} });

  const [errorMessage, setErrorMessage] = useState("");
  const [DeleteShowModal, setDeleteShowModal] = useState(false);
  const [ModifyShowModal, setModifyShowModal] = useState(false);
  const [AddShowModal, setShowAddModal] = useState(false);
  const [SuccessShowModal, setSuccessShowModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<Url | null>(null);
  const [deletingUrl, setDeletingUrlId] = useState("");

  const { searchQuery } = useContext(SearchContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleUpdateUrl = (url: Url) => {
    setCurrentUrl(url);
    setModifyShowModal(true);
    form.reset({
      url: url.url,
      CompanyName: url.CompanyName,
      Description: url.Description,
    });
  };

  const handleDeleteUrl = (urlId: string) => {
    setDeletingUrlId(urlId);
    setDeleteShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUrlMutation.mutateAsync(deletingUrl);
      setDeleteShowModal(false);
      setDeletingUrlId("");
    } catch (error: any) {
      console.error("Error deleting url:", error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeleteShowModal(false);
    setDeletingUrlId("");
  };

  const handleModalClose = () => {
    setModifyShowModal(false);
    setShowAddModal(false);
    setDeleteShowModal(false);
    setCurrentUrl(null);
  };

  const handleSuccessModalClose = async () => {
    setSuccessShowModal(false);
    await refetch();
  };

  const filteredData =
    data?.filter((url: Url) =>
      `${url.CompanyName} ${url.url}  ${url.Description}`
        .toLowerCase()
        .match(searchQuery.toLowerCase())
    ) || [];

  const onSubmit = async () => {
    if (currentUrl) {
      try {
        const updatedUrlResponse = await updateUrlMutation.mutateAsync({
          ...form.getValues(),
          id: currentUrl?.id ?? "0",
        });
        console.log("url updated successfully:", updatedUrlResponse);
        handleModalClose();
      } catch (error: any) {
        console.error("Error updating url:", error);
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      }
    } else {
      try {
        const formData = form.getValues();
        const addData = {
          url: formData.url,
          CompanyName: formData.CompanyName,
          Description: formData.Description,
        };
        await createUrlMutation.mutateAsync(addData);
        console.log("url added successfully");
        handleModalClose();
        setSuccessShowModal(true);
      } catch (error: any) {
        console.error("Error adding url:", error);
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      }
    }
  };

  return (
    <Card>
      <div className="flex flex-row justify-between items-center ">
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>A list of all Links.</CardDescription>
        </CardHeader>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white m-6"
        >
          Add Link
        </Button>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Url</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((url: Url) => (
              <TableRow key={url.id}>
                <TableCell className="font-medium">{url.url}</TableCell>
                <TableCell>{url.CompanyName}</TableCell>
                <TableCell>{url.Description}</TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(url.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex flex-row ">
                  <button
                    onClick={() => handleUpdateUrl(url)}
                    className="bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDeleteUrl(url.id)}
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
                  {currentUrl ? "Update Link" : "Add Link"}
                </CardTitle>
                <CardDescription>
                  {currentUrl
                    ? "Update Link information."
                    : "Fill in the information to add a new link."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form>
                    <FormField
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input placeholder="link" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="CompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="Description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description" {...field} />
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
                        onClick={onSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {currentUrl ? "Update" : "Add"}
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
                <p>Are you sure you want to delete this link?</p>
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
                  {currentUrl ? "Successfully Updated." : "Successfully Added."}
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

export default UrlsPage;
