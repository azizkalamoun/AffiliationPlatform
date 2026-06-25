import api from "@/api";
import { Subscription, SubscriptionWithUserAndUrl } from "@/types";
import {
  UseMutationOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const fetchAllSubscriptions = async () => {
  const response: AxiosResponse<{
    success: boolean;
    data: SubscriptionWithUserAndUrl[];
  }> = await api.get("/subscriptions");
  return response.data.data;
};

export const useFetchAllSubscriptionsQuery = (
  options: any
): UseQueryResult<SubscriptionWithUserAndUrl[]> => {
  return useQuery<SubscriptionWithUserAndUrl[], AxiosError>({
    queryKey: ["fetchAllSubscriptions"],
    queryFn: fetchAllSubscriptions,
    ...options,
  });
};
