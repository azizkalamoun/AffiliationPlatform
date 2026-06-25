import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { Click, createClickProps } from "@/types";

export const fetchAllClicks = async () => {
  const response: AxiosResponse<Click[]> = await api.get("/clicks");
  return response.data;
};

export const useFetchAllClicksQuery = (
  options?: UseQueryOptions<Click[], AxiosError>
) => {
  return useQuery<Click[], AxiosError>({
    queryKey: ["fetchAllClicks"],
    queryFn: fetchAllClicks,
    ...options,
  });
};

// Create a new click
export const createClick = async ({ urlId, affiliateId }: createClickProps) => {
  const response: AxiosResponse<Click> = await api.post("/clicks/new", {
    urlId,
    affiliateId,
  });
  return response.data;
};

export const useCreateClickMutation = ({
  options,
}: {
  options?: UseMutationOptions<Click, AxiosError, createClickProps>;
}) => {
  return useMutation<Click, AxiosError, createClickProps>({
    mutationKey: ["createClick"],
    mutationFn: createClick,
    ...options,
  });
};
