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
import { useFetchAllUrlsQuery } from "@/services/url";
import Modal from "@/components/ui/modal";
import { Url } from "@/types";
import { useCreateAffiliateUrlMutation } from "@/services/affiliateUrl";
import { getActiveUserIdFromTokens } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { SearchContext } from "../layout";

function UrlsPage() {
  const { data } = useFetchAllUrlsQuery({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const activeUserId = getActiveUserIdFromTokens();
  const createAffiliateUrlMutation = useCreateAffiliateUrlMutation({
    onSuccess: () => {
      setModalMessage("Successfully submitted request.");
      setIsModalOpen(true);
    },
    onError: () => {
      setModalMessage("Already submitted request to this url.");
      setIsModalOpen(true);
    },
  });

  const { searchQuery } = useContext(SearchContext);

  const filteredData =
    data?.filter((url: Url) =>
      `${url.CompanyName} ${url.url}  ${url.Description}`
        .toLowerCase()
        .match(searchQuery.toLowerCase())
    ) || [];
  const handleSubmitRequest = async (url: Url) => {
    if (activeUserId) {
      await createAffiliateUrlMutation.mutateAsync({
        affiliateId: activeUserId,
        urlId: url.id,
      });
    }
  };
  const handleSuccessModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>A list of all Links.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Url</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((url: Url) => (
              <TableRow key={url.id}>
                <TableCell className="font-medium">{url.url}</TableCell>
                <TableCell className="font-medium">{url.CompanyName}</TableCell>
                <TableCell className="font-medium">{url.Description}</TableCell>
                <TableCell className="flex flex-row">
                  <button
                    onClick={() => handleSubmitRequest(url)}
                    className="bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded"
                  >
                    Submit Request
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-10">
            {" "}
            <p>{modalMessage}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button onClick={handleSuccessModalClose}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

export default UrlsPage;
