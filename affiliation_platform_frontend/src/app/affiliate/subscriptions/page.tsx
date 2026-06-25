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
import { fetchUserById } from "@/services/affiliateUrl";
import { useFetchAllSubscriptionsQuery } from "@/services/subscription";
import { Subscription, User } from "@/types";
import { getActiveUserIdFromTokens } from "@/utils/auth";
import { useEffect, useState } from "react";

function Page() {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const { data } = useFetchAllSubscriptionsQuery({ as: "affiliate" });
  console.log(data);

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

  const filteredData =
    data?.filter((sub: Subscription) =>
      `${sub.affiliateId} `.toLowerCase().match(activeUser?.id)
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
              <TableHead>referenced email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredData) &&
              filteredData.length > 0 &&
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.url.url}</TableCell>
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
