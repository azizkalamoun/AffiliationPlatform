"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  useFetchAllAffiliateUrlsQuery,
  fetchUrlById,
  fetchUserById,
  useApproveAffiliateUrlsMutation,
  useDenyAffiliateUrlsMutation,
} from "@/services/affiliateUrl";
import { AffiliateUrl, Url, User } from "@/types";

const PromotionRequestsPage = () => {
  const { data: affiliateUrls, refetch } = useFetchAllAffiliateUrlsQuery();

  const [urls, setUrls] = useState<{ [key: string]: Url }>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
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

  useEffect(() => {
    if (affiliateUrls) {
      const fetchUrlsAndUsers = async () => {
        const url_ids = affiliateUrls.map(
          (affiliateUrl: AffiliateUrl) => affiliateUrl.url_id
        );
        const userIds = affiliateUrls.map(
          (affiliateUrl: AffiliateUrl) => affiliateUrl.affiliate_id
        );
        try {
          const urlsResponse = await Promise.all(url_ids.map(fetchUrlById));
          const usersResponse = await Promise.all(userIds.map(fetchUserById));

          const urlsMap: { [key: string]: Url } = {};
          urlsResponse.forEach((url: Url) => {
            urlsMap[url.id] = url;
          });
          setUrls(urlsMap);

          const usersMap: { [key: string]: User } = {};
          usersResponse.forEach((user: User) => {
            usersMap[user.id] = user;
          });
          setUsers(usersMap);
        } catch (error) {
          console.error("Error fetching URL and User information:", error);
        }
      };
      fetchUrlsAndUsers();
    }
  }, [affiliateUrls]);

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
              affiliateUrls
                .filter((affiliateUrl) => affiliateUrl.status === "pending")
                .map((affiliateUrl: AffiliateUrl) => (
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
                      {users[affiliateUrl.affiliate_id]?.firstName}{" "}
                      {users[affiliateUrl.affiliate_id]?.lastName}
                    </TableCell>
                    <TableCell>
                      {users[affiliateUrl.affiliate_id]?.occupation}
                    </TableCell>
                    <TableCell>{urls[affiliateUrl.url_id]?.url}</TableCell>
                    <TableCell>
                      {urls[affiliateUrl.url_id]?.CompanyName}
                    </TableCell>
                    <TableCell>
                      {urls[affiliateUrl.url_id]?.Description}
                    </TableCell>

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
                ))
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
