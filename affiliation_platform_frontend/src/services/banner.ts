import {
  UseMutationOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { Banner } from "@/types";

export const fetchAllBanners = async () => {
  const response: AxiosResponse<Banner[]> = await api.get("/banners");
  return response.data;
};

export const useFetchAllBannersQuery = (
  options?: any
): UseQueryResult<Banner[]> => {
  return useQuery<Banner[]>({
    queryKey: ["fetchAllBanners"],
    queryFn: fetchAllBanners,
    ...options,
  });
};

export const createBanner = async ({
  src,
  urlId,
}: {
  src: string;
  urlId: string;
}) => {
  const response: AxiosResponse<Banner> = await api.post("/banners/new", {
    src,
    urlId,
  });
  return response.data;
};

export const useCreateBannerMutation = ({
  options,
}: {
  options?: UseMutationOptions<
    Banner,
    AxiosError,
    { src: string; urlId: string }
  >;
}) => {
  return useMutation<Banner, AxiosError, { src: string; urlId: string }>({
    mutationKey: ["createBanner"],
    mutationFn: createBanner,
    ...options,
  });
};

export const deleteBanner = async (id: string) => {
  const response: AxiosResponse<void> = await api.delete(
    `/banners/${id}/delete`
  );
  return response.data;
};

export const useDeleteBannerMutation = ({
  options,
}: {
  options?: UseMutationOptions<void, AxiosError, string>;
}) => {
  return useMutation<void, AxiosError, string>({
    mutationKey: ["deleteBanner"],
    mutationFn: deleteBanner,
    ...options,
  });
};
export const fetchBannersByUrlId = async (urlId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/banners/url/${urlId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching banners by URL ID:", error);
    throw new Error("Failed to fetch banners by URL ID");
  }
};
