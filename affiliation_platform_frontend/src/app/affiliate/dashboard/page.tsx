"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFetchLatestSubscriptionsQuery,
  useFetchAffiliateClicksByUrlQuery,
  useFetchAffiliateSubscriptionsByUrlQuery,
  useFetchAffiliateAdvertisedUrlsQuery,
} from "@/services/dashboard";
import { getActiveUserIdFromTokens } from "@/utils/auth";
import { Select } from "@/components/ui/select";
import { IconClick, IconUnlink, IconUserPlus } from "@tabler/icons-react";

export default function DashboardPage() {
  const [selectedUrlId, setSelectedUrlId] = useState<string | undefined>(
    undefined
  );
  const activeUserId = getActiveUserIdFromTokens();

  const { data: latestSubscriptions, isLoading: isLoadingLatestSubscriptions } =
    useFetchLatestSubscriptionsQuery(activeUserId, selectedUrlId);

  const { data: clicksCount, isLoading: isLoadingClicks } =
    useFetchAffiliateClicksByUrlQuery(activeUserId, selectedUrlId);
  const {
    data: affiliateSubscriptionsCount,
    isLoading: isLoadingAffiliateSubscriptions,
  } = useFetchAffiliateSubscriptionsByUrlQuery(activeUserId, selectedUrlId);

  const { data: advertisedUrls, isLoading: isLoadingAdvertisedUrls } =
    useFetchAffiliateAdvertisedUrlsQuery(activeUserId);

  const handleUrlChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUrlId(event.target.value.toString());
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-row  justify-between items-center">
          <h1 className="text-lg font-semibold md:text-2xl ml-2">Dashboard</h1>
          <Select
            onChange={handleUrlChange}
            className="bg-white rounded-sm text-black shadow-lg w-fit font-medium"
          >
            <option value="" selected disabled>
              Select Link
            </option>
            {advertisedUrls?.urls.map((url) => (
              <option key={url.id} value={url.id}>
                {url.url}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-row items-start justify-center gap-4 mb-4 mt-4 rounded-md">
          <Card className="w-1/3 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Links</CardTitle>
              <IconUnlink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingAdvertisedUrls ? "Loading..." : advertisedUrls?.count}
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/3 h-full">
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
          <Card className="w-1/3 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <IconUserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingAffiliateSubscriptions
                  ? "Loading..."
                  : affiliateSubscriptionsCount?.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {affiliateSubscriptionsCount?.percentageChange}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card x-chunk="dashboard-01-chunk-6">
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Url</TableHead>
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
                        {subscription.sub?.email}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
