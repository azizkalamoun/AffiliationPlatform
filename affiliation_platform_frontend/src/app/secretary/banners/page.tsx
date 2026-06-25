"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  deleteFileFromFirebase,
  uploadFileToFirebase,
} from "@/lib/firebaseUtils";
import {
  useFetchAllBannersQuery,
  useDeleteBannerMutation,
  useCreateBannerMutation,
} from "@/services/banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Banner, Url } from "@/types";
import { useFetchAllUrlsQuery } from "@/services/url";
import { Select } from "@/components/ui/select";

const formSchema = z.object({
  urlId: z.string().min(1, { message: "URL ID is required" }),
  file: z.instanceof(File, { message: "File is required" }).optional(),
});

function BannersPage() {
  const { data: UrlData } = useFetchAllUrlsQuery({});
  const { data: bannersData, refetch } = useFetchAllBannersQuery({});
  const deleteBannerMutation = useDeleteBannerMutation({ options: {} });
  const createBannerMutation = useCreateBannerMutation({ options: {} });
  const [DeleteShowModal, setDeleteShowModal] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState("");
  const [deletingBannerSrc, setDeletingBannerSrc] = useState("");
  const [AddShowModal, setAddShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleDeleteBanner = (bannerId: string, src: string) => {
    setDeletingBannerId(bannerId);
    setDeletingBannerSrc(src);
    setDeleteShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFileFromFirebase(deletingBannerSrc);

      await deleteBannerMutation.mutateAsync(deletingBannerId);

      setDeleteShowModal(false);
      setDeletingBannerId("");
      await refetch();
    } catch (error: any) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteShowModal(false);
    setDeletingBannerId("");
  };

  const handleAddBanner = () => {
    setAddShowModal(true);
  };

  const handleOpenImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImageUrl("");
    setImageModalOpen(false);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const file = data.file;
      if (!file) {
        console.error("No file selected");
        return;
      }

      const fileName = `${data.urlId}-${file.name}`;
      await uploadFileToFirebase(fileName, file, (progress: number) =>
        setUploadProgress(progress)
      ).then((fileUrl) =>
        createBannerMutation.mutateAsync({
          src: fileUrl,
          urlId: data.urlId,
        })
      );

      setUploadProgress(0);
      setAddShowModal(false);
      form.reset({});
      await refetch();
    } catch (error: any) {
      console.error("Error adding banner:", error);
    }
  };

  const getUrlById = (id: string): string | undefined => {
    const url = UrlData?.find((url: Url) => url.id === id);
    return url ? url.url : undefined;
  };

  return (
    <Card>
      <div className="flex flex-row justify-between items-center ">
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>A list of all Banners.</CardDescription>
        </CardHeader>
        <Button
          onClick={handleAddBanner}
          className="bg-green-500 hover:bg-green-600 text-white m-6"
        >
          Add Banner
        </Button>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bannersData?.map((banner: Banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img
                    src={banner.src}
                    alt=""
                    className="h-32 cursor-pointer"
                    onClick={() => handleOpenImageModal(banner.src)}
                  />
                </TableCell>
                <TableCell>{getUrlById(banner.urlId)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDeleteBanner(banner.id, banner.src)}
                    className="bg-red-500 hover:bg-red-700 text-white font-normal py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
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
                <p>Are you sure you want to delete this banner?</p>
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
      {AddShowModal && (
        <Modal onClose={() => setAddShowModal(false)}>
          <div className="container mx-auto flex items-center justify-center">
            <div className="w-fit">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Add Banner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                  >
                    <FormField
                      name="urlId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <option value="" disabled selected>
                                Select Link
                              </option>
                              {UrlData?.map((url: Url) => (
                                <option key={url.id} value={url.id}>
                                  {url.url}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                  setUploadProgress(0); // Reset progress on file change
                                }
                              }}
                              accept="image/png, image/gif, image/jpeg, image/jpg"
                            />
                          </FormControl>
                          <FormMessage />
                          {uploadProgress > 0 && (
                            <div>
                              Upload Progress: {uploadProgress.toFixed(2)}%
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-center mt-4">
                      <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
      {isImageModalOpen && (
        <Modal onClose={handleCloseImageModal}>
          <div className="pt-8">
            <img
              src={selectedImageUrl}
              alt=""
              className="max-w-full max-h-full"
            />
          </div>
        </Modal>
      )}
    </Card>
  );
}

export default BannersPage;
