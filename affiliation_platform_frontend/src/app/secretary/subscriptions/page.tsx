"use client";

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
import { useFetchAllSubscriptionsQuery } from "@/services/subscription";
import { Subscription } from "@/types";
import { SearchContext } from "../layout";
import { useContext } from "react";

function Page() {
  const { searchQuery } = useContext(SearchContext);

  const { data } = useFetchAllSubscriptionsQuery({ as: "affiliate" });
  console.log(data);

  const filteredData =
    data?.filter((sub: Subscription) =>
      `${sub.sub?.email} ${sub.url?.url}`
        .toLowerCase()
        .match(searchQuery.toLowerCase())
    ) || [];

  return (
    <Card>
      <div className="flex flex-row justify-between items-center ">
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>A list of all subscriptions.</CardDescription>
        </CardHeader>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Url</TableHead>
              <TableHead>Affiliate email</TableHead>
              <TableHead>Referenced email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) &&
              filteredData.length > 0 &&
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.url.url}</TableCell>
                  <TableCell>{item.affiliate.email}</TableCell>
                  <TableCell>{item.sub.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Page;
