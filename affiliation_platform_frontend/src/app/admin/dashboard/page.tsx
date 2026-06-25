"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFetchAffiliatesCountQuery,
  useFetchLatestUsersQuery,
  useFetchLatestSubscriptionsQuery,
  useFetchAffiliateAdvertisedUrlsQuery,
  useFetchAffiliateSubscriptionsByUrlQuery,
  useFetchAffiliateClicksByUrlQuery,
} from "@/services/dashboard";
import { User } from "@/types";
import { IconClick, IconUnlink, IconUserPlus } from "@tabler/icons-react";
import { Users } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function DashboardPage() {
  const [selectedUrlId, setSelectedUrlId] = useState<string | undefined>(
    undefined
  );
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<
    string | undefined
  >(undefined);

  const { data: affiliatesCount, isLoading: isLoadingAffiliates } =
    useFetchAffiliatesCountQuery();
  const { data: urlsCount, isLoading: isLoadingUrls } =
    useFetchAffiliateAdvertisedUrlsQuery(selectedAffiliateId);
  const { data: latestSubscriptions, isLoading: isLoadingLatestSubscriptions } =
    useFetchLatestSubscriptionsQuery(selectedAffiliateId, selectedUrlId);
  const { data: clicksCount, isLoading: isLoadingClicks } =
    useFetchAffiliateClicksByUrlQuery(selectedAffiliateId, selectedUrlId);
  const { data: subscriptionsCount, isLoading: isLoadingSubscriptions } =
    useFetchAffiliateSubscriptionsByUrlQuery(
      selectedAffiliateId,
      selectedUrlId
    );
  const { data: latestUsers, isLoading: isLoadingLatestUsers } =
    useFetchLatestUsersQuery();

  const handleUrlChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUrlId(event.target.value.toString());
  };
  const handleAffiliateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAffiliateId(event.target.value.toString());
  };
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl ml-2">Dashboard</h1>
          <div className="flex flex-row space-x-4">
            {" "}
            <Select
              onChange={handleUrlChange}
              className="bg-white rounded-sm text-black shadow-lg w-fit"
            >
              <option value="">Select Link</option>
              {urlsCount?.urls.map((url) => (
                <option key={url.id} value={url.id}>
                  {url.url}
                </option>
              ))}
            </Select>
            <Select
              onChange={handleAffiliateChange}
              className="bg-white rounded-sm text-black shadow-lg w-fit"
            >
              <option value="">Select Affiliate</option>
              {affiliatesCount?.affiliates.rows.map((affiliate: User) => (
                <option key={affiliate.id} value={affiliate.id}>
                  {affiliate.firstName} {affiliate.lastName}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-row items-start justify-center gap-4 mb-4 mt-4 rounded-md ">
          <Card className="w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingAffiliates
                  ? "Loading..."
                  : affiliatesCount?.affiliates.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {affiliatesCount?.percentageChange}
              </p>
            </CardContent>
          </Card>
          <Card className="w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <IconUserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingSubscriptions
                  ? "Loading..."
                  : subscriptionsCount?.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {subscriptionsCount?.percentageChange}
              </p>
            </CardContent>
          </Card>
          <Card className="w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              <IconClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingClicks ? "Loading..." : clicksCount?.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {clicksCount?.percentageChange}
              </p>
            </CardContent>
          </Card>
          <Card className="w-1/4 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Links</CardTitle>
              <IconUnlink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingUrls ? "Loading..." : urlsCount?.count}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
          <Card x-chunk="dashboard-01-chunk-5" className="w-1/2">
            <CardHeader>
              <CardTitle>Recent Affiliates</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLatestUsers ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    latestUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {`${user.firstName} ${user.lastName}`}{" "}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-6" className="w-1/2 ">
            <CardHeader>
              <CardTitle>Recent Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Affiliate Email</TableHead>
                    <TableHead>Referenced Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLatestSubscriptions ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    latestSubscriptions?.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">
                          {subscription.url.url}
                        </TableCell>
                        <TableCell>{subscription.affiliate.email}</TableCell>
                        <TableCell className="break-words">
                          {subscription.newUser?.email}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
