"use client";

import { Button } from "@/components/ui/button";
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
  useApproveAffiliateUrlsMutation,
  useDenyAffiliateUrlsMutation,
  useFetchAllAffiliateUrlsQuery,
} from "@/services/affiliateUrl";
import { AffiliateUrl } from "@/types/affiliateUrl";
import { useState } from "react";

const PromotionRequestsPage = () => {
  const { data: affiliateUrls, refetch } = useFetchAllAffiliateUrlsQuery();
  const [selectedAffiliateUrls, setSelectedAffiliateUrls] = useState<
    {
      affiliate_id: string;
      url_id: string;
    }[]
  >([]);

  const approveAffiliateUrlsMutation = useApproveAffiliateUrlsMutation({
    options: {},
  });
  const denyAffiliateUrlsMutation = useDenyAffiliateUrlsMutation({
    options: {},
  });
  const handleApproveSelected = async () => {
    await approveAffiliateUrlsMutation.mutateAsync({
      urls: selectedAffiliateUrls,
    });
    setSelectedAffiliateUrls([]);
    await refetch();
  };

  const handleDenySelected = async () => {
    await denyAffiliateUrlsMutation.mutateAsync({
      urls: selectedAffiliateUrls,
    });
    setSelectedAffiliateUrls([]);
    await refetch();
  };

  const toggleAffiliateUrlSelection = (
    affiliate_id: string,
    url_id: string
  ) => {
    setSelectedAffiliateUrls((prevSelectedUrls) => {
      const exists = prevSelectedUrls.some(
        (url) => url.affiliate_id === affiliate_id && url.url_id === url_id
      );
      if (exists) {
        return prevSelectedUrls.filter(
          (url) => url.affiliate_id !== affiliate_id || url.url_id !== url_id
        );
      } else {
        return [...prevSelectedUrls, { affiliate_id, url_id }];
      }
    });
  };

  const toggleAllAffiliateUrlsSelection = () => {
    if (
      affiliateUrls &&
      selectedAffiliateUrls.length === affiliateUrls.length
    ) {
      setSelectedAffiliateUrls([]);
    } else {
      if (affiliateUrls) {
        const allUrls = affiliateUrls.map((affiliateUrl: AffiliateUrl) => ({
          affiliate_id: affiliateUrl.affiliate_id,
          url_id: affiliateUrl.url_id,
        }));
        setSelectedAffiliateUrls(allUrls);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotion Requests</CardTitle>
        <CardDescription>
          A list of affiliates awaiting promotion requests.
        </CardDescription>
        <div className="flex justify-end items-center">
          <Button
            onClick={handleApproveSelected}
            disabled={selectedAffiliateUrls.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Approve Selected
          </Button>
          <Button
            onClick={handleDenySelected}
            disabled={selectedAffiliateUrls.length === 0}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Deny Selected
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={
                    affiliateUrls
                      ? selectedAffiliateUrls.length === affiliateUrls.length
                      : false
                  }
                  onChange={toggleAllAffiliateUrlsSelection}
                />
              </TableHead>
              <TableHead>Affiliate Name</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliateUrls && affiliateUrls.length > 0 ? (
              affiliateUrls.map(
                (affiliateUrl: {
                  affiliate_id: string;
                  url_id: string;
                  status: string;
                  url: string;
                  CompanyName: string;
                  Description: string;
                  createdAt: string;
                  updatedAt: string;
                  email: string;
                  password: string;
                  firstName: string;
                  lastName: string;
                  occupation: string;
                  age: string;
                  gender: string;
                  phoneNumber: string;
                  country: string;
                }) => (
                  <TableRow
                    key={affiliateUrl.affiliate_id + "-" + affiliateUrl.url_id}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedAffiliateUrls.some(
                          (url) =>
                            url.affiliate_id === affiliateUrl.affiliate_id &&
                            url.url_id === affiliateUrl.url_id
                        )}
                        onChange={() =>
                          toggleAffiliateUrlSelection(
                            affiliateUrl.affiliate_id,
                            affiliateUrl.url_id
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {affiliateUrl.firstName} {affiliateUrl?.lastName}
                    </TableCell>
                    <TableCell>{affiliateUrl?.occupation}</TableCell>
                    <TableCell>{affiliateUrl?.url}</TableCell>
                    <TableCell>{affiliateUrl.CompanyName}</TableCell>
                    <TableCell>{affiliateUrl.Description}</TableCell>

                    <TableCell className="flex flex-row space-x-2">
                      <Button
                        onClick={async () =>
                          await approveAffiliateUrlsMutation.mutateAsync(
                            {
                              urls: [
                                {
                                  affiliate_id: affiliateUrl.affiliate_id,
                                  url_id: affiliateUrl.url_id,
                                },
                              ],
                            },
                            {
                              onSuccess: async () => {
                                await refetch();
                              },
                            }
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={async () =>
                          await denyAffiliateUrlsMutation.mutateAsync(
                            {
                              urls: [
                                {
                                  affiliate_id: affiliateUrl.affiliate_id,
                                  url_id: affiliateUrl.url_id,
                                },
                              ],
                            },
                            {
                              onSuccess: async () => {
                                await refetch();
                              },
                            }
                          )
                        }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PromotionRequestsPage;
