"use client";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { Feedback } from "@/types";
import { fetchUserById } from "@/services/affiliateUrl";
import {
  useDeleteFeedbackMutation,
  useFetchAllFeedbacksQuery,
} from "@/services/feedback";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchContext } from "../layout";

function FeedbacksPage() {
  const { data, refetch } = useFetchAllFeedbacksQuery({});
  const deleteFeedbackMutation = useDeleteFeedbackMutation({});

  const [deleteShowModal, setDeleteShowModal] = useState(false);
  const [deletingFeedback, setDeletingFeedbackId] = useState("");
  const [feedbackUserEmail, setFeedbackUserEmail] = useState("");
  const { searchQuery } = useContext(SearchContext);

  const handleDeleteFeedback = (feedbackId: string) => {
    setDeletingFeedbackId(feedbackId);
    setDeleteShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFeedbackMutation.mutateAsync(deletingFeedback);
      setDeleteShowModal(false);
      setDeletingFeedbackId("");
      await refetch();
    } catch (error: any) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteShowModal(false);
    setDeletingFeedbackId("");
  };

  const fetchUserEmail = async (userId: string) => {
    try {
      const user = await fetchUserById(userId);
      setFeedbackUserEmail(user.email);
    } catch (error: any) {
      console.error("Error fetching user email:", error);
    }
  };

  useEffect(() => {
    if (data) {
      data.forEach((feedback: Feedback) => {
        fetchUserEmail(feedback.userId);
      });
    }
  }, [data]);

  const filteredData =
    data?.filter((feedback: Feedback) =>
      `${feedback.subject} ${feedback.object}`
        .toLowerCase()
        .match(searchQuery.toLowerCase())
    ) || [];

  const sortedData = [...(filteredData || [])].sort(
    (a: Feedback, b: Feedback) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <div className="flex flex-row justify-between items-center ">
        <CardHeader>
          <CardTitle>Feedbacks</CardTitle>
          <CardDescription>A list of all submitted feedbacks.</CardDescription>
        </CardHeader>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Object</TableHead>
              <TableHead>Affiliate Email</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((feedback: Feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.subject}</TableCell>
                <TableCell>
                  <p className="max-w-96 break-words transition-all duration-500 ease-out max-h-8 hover:max-h-screen overflow-hidden">
                    {feedback.object}
                  </p>
                </TableCell>
                <TableCell>{feedbackUserEmail}</TableCell>
                <TableCell>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDeleteFeedback(feedback.id)}
                    className="bg-red-500  hover:bg-red-700 text-white font-normal py-2 px-4 rounded "
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {deleteShowModal && (
        <Modal onClose={handleCancelDelete}>
          <div className="container mx-auto flex items-center justify-center">
            <div className="mx-auto w-fit">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Confirm Delete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Are you sure you want to delete this feedback?</p>
                <div className="flex justify-center space-x-4 mt-4 ">
                  <button
                    onClick={handleCancelDelete}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600  text-white font-bold py-2 px-4 rounded"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </CardContent>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

export default FeedbacksPage;
