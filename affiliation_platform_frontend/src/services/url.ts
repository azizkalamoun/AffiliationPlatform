import {
  UseMutationOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { Url, createUrlProps, updateUrlProps } from "@/types";

export const fetchAllUrls = async () => {
  const response: AxiosResponse<Url[]> = await api.get("/urls");
  return response.data?.data;
};

export const useFetchAllUrlsQuery = (options?: any): UseQueryResult<Url[]> => {
  return useQuery<Url[]>({
    queryKey: ["fetchAllUrls"],
    queryFn: fetchAllUrls,
    ...options,
  });
};

export const createUrl = async ({
  url,
  CompanyName,
  Description,
}: createUrlProps) => {
  const response: AxiosResponse<Url> = await api.post("/urls/new", {
    url,
    CompanyName,
    Description,
  });
  return response.data;
};

export const useCreateUrlMutation = ({
  options,
}: {
  options?: UseMutationOptions<Url, AxiosError, createUrlProps>;
}) => {
  return useMutation<Url, AxiosError, createUrlProps>({
    mutationKey: ["createUrl"],
    mutationFn: createUrl,
    ...options,
  });
};

export const updateUrl = async ({
  id,
  url,
  CompanyName,
  Description,
}: updateUrlProps) => {
  const response: AxiosResponse<Url> = await api.put(`/urls/${id}/edit`, {
    url,
    CompanyName,
    Description,
  });
  return response.data;
};

export const useUpdateUrlMutation = ({
  options,
}: {
  options?: UseMutationOptions<Url, AxiosError, updateUrlProps>;
}) => {
  return useMutation<Url, AxiosError, updateUrlProps>({
    mutationKey: ["updateUrl"],
    mutationFn: updateUrl,
    ...options,
  });
};

export const deleteUrl = async (id: string) => {
  const response: AxiosResponse<void> = await api.delete(`/urls/${id}/delete`);
  return response.data;
};

export const useDeleteUrlMutation = ({
  options,
}: {
  options?: UseMutationOptions<void, AxiosError, string>;
}) => {
  return useMutation<void, AxiosError, string>({
    mutationKey: ["deleteUrl"],
    mutationFn: deleteUrl,
    ...options,
  });
};
