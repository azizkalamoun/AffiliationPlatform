import {
  UseMutationOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { Feedback, createFeedbackProps, updateFeedbackProps } from "@/types";

export const fetchAllFeedbacks = async () => {
  const response: AxiosResponse<Feedback[]> = await api.get("/feedbacks");
  return response.data;
};

export const useFetchAllFeedbacksQuery = (
  options?: any
): UseQueryResult<Feedback[]> => {
  return useQuery<Feedback[]>({
    queryKey: ["fetchAllFeedbacks"],
    queryFn: fetchAllFeedbacks,
    ...options,
  });
};

export const createFeedback = async ({
  subject,
  object,
  userId,
}: createFeedbackProps) => {
  const response: AxiosResponse<Feedback> = await api.post("/feedbacks/new", {
    subject,
    object,
    userId,
  });
  return response.data;
};

export const useCreateFeedbackMutation = ({
  options,
}: {
  options?: UseMutationOptions<Feedback, AxiosError, createFeedbackProps>;
}) => {
  return useMutation<Feedback, AxiosError, createFeedbackProps>({
    mutationKey: ["createFeedback"],
    mutationFn: createFeedback,
    ...options,
  });
};

export const deleteFeedback = async (id: string) => {
  const response: AxiosResponse<void> = await api.delete(
    `/feedbacks/${id}/delete`
  );
  return response.data;
};

export const useDeleteFeedbackMutation = ({
  options,
}: {
  options?: UseMutationOptions<void, AxiosError, string>;
}) => {
  return useMutation<void, AxiosError, string>({
    mutationKey: ["deleteFeedback"],
    mutationFn: deleteFeedback,
    ...options,
  });
};
