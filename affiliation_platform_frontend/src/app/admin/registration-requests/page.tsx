"use client";
import { useState } from "react";
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
  useFetchAllUsersQuery,
  useApproveRegistrationMutation,
  useDenyRegistrationMutation,
} from "@/services/user";
import { User } from "@/types";

function WaitingListPage() {
  const { data, refetch } = useFetchAllUsersQuery({});
  const approveRegistrationMutation = useApproveRegistrationMutation({
    options: {},
  });
  const denyRegistrationMutation = useDenyRegistrationMutation({
    options: {},
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers?.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...(prevSelectedUsers || []), userId];
      }
    });
  };

  const toggleAllUsersSelection = () => {
    setSelectedUsers((prevSelectedUsers) => {
      if (
        prevSelectedUsers?.length ===
        data?.data.filter((user) => user.status === "waiting list").length
      ) {
        return [];
      } else {
        return (
          data?.data
            .filter((user) => user.status === "waiting list")
            .map((user: User) => user.id) || []
        );
      }
    });
  };

  const handleApproveRegistrationBulk = async () => {
    await approveRegistrationMutation.mutateAsync({
      affiliatesIds: selectedUsers,
    });
    setSelectedUsers([]);
    await refetch();
  };

  const handleDenyRegistrationBulk = async () => {
    await denyRegistrationMutation.mutateAsync({
      affiliatesIds: selectedUsers,
    });
    setSelectedUsers([]);
    await refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiting List</CardTitle>
        <CardDescription>
          A list of affiliates awaiting registration approval.
        </CardDescription>
        <div className="flex justify-end items-center">
          <Button
            onClick={handleApproveRegistrationBulk}
            disabled={selectedUsers.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Approve Selected
          </Button>
          <Button
            onClick={handleDenyRegistrationBulk}
            disabled={selectedUsers.length === 0}
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
                    selectedUsers.length ===
                    data?.data.filter((user) => user.status === "waiting list")
                      .length
                  }
                  onChange={toggleAllUsersSelection}
                />
              </TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data
              .filter((user) => user.status === "waiting list")
              .map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex flex-row space-x-2">
                    <Button
                      onClick={async () =>
                        await approveRegistrationMutation.mutateAsync(
                          {
                            affiliatesIds: [user.id],
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
                        await denyRegistrationMutation.mutateAsync(
                          {
                            affiliatesIds: [user.id],
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
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default WaitingListPage;
