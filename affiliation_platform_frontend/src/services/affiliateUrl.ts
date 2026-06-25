import api from "@/api";
import { Url, User } from "@/types";
import {
  AffiliateUrl,
  ApproveDenyAffiliateUrlProps,
  CreateAffiliateUrlProps,
  FetchUrlsOfUserResponse,
} from "@/types/affiliateUrl";
import {
  UseMutationOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const fetchAllAffiliateUrls = async () => {
  try {
    const response: AxiosResponse<{
      success: boolean;
      data: {
        affiliate_id: string;
        url_id: string;
        status: string;
        url: string;
        CompanyName: string;
        Description: string;
        createdAt: string;
        updatedAt: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        occupation: string;
        age: string;
        gender: string;
        phoneNumber: string;
        country: string;
      }[];
    }> = await api.get("/affiliate-urls");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching affiliate Links:", error);
    throw error;
  }
};
export const useFetchAllAffiliateUrlsQuery = (
  options?: any
): UseQueryResult<
  {
    affiliate_id: string;
    url_id: string;
    status: string;
    url: string;
    CompanyName: string;
    Description: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    occupation: string;
    age: string;
    gender: string;
    phoneNumber: string;
    country: string;
  }[]
> => {
  return useQuery<
    {
      affiliate_id: string;
      url_id: string;
      status: string;
      url: string;
      CompanyName: string;
      Description: string;
      createdAt: string;
      updatedAt: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      occupation: string;
      age: string;
      gender: string;
      phoneNumber: string;
      country: string;
    }[]
  >({
    queryKey: ["fetch-all-affiliate-urls"],
    queryFn: fetchAllAffiliateUrls,
    ...options,
    staleTime: 0,
  });
};

export const fetchUrlsOfUser = async () => {
  try {
    const response: AxiosResponse<FetchUrlsOfUserResponse> = await api.get(
      "/affiliate-my-urls"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching affiliate Links:", error);
    throw error;
  }
};
export const useFetchUrlsOfUser = (
  options?: any
): UseQueryResult<FetchUrlsOfUserResponse> => {
  return useQuery<FetchUrlsOfUserResponse>({
    queryKey: ["affiliate-my-urls"],
    queryFn: fetchUrlsOfUser,
    ...options,
  });
};

export const fetchUrlById = async (id: string): Promise<Url> => {
  const response = await api.get(`/urls/${id}`);
  return response.data.data;
};

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
};

const createAffiliateUrl = async ({
  affiliateId,
  urlId,
}: CreateAffiliateUrlProps) => {
  const response: AxiosResponse<AffiliateUrl> = await api.post(
    "/affiliate-urls/new",
    {
      affiliateId,
      urlId,
    }
  );
  return response.data;
};

export const useCreateAffiliateUrlMutation = (
  options?: UseMutationOptions<
    AffiliateUrl,
    AxiosError,
    CreateAffiliateUrlProps
  >
) => {
  return useMutation<AffiliateUrl, AxiosError, CreateAffiliateUrlProps>({
    mutationFn: createAffiliateUrl,
    ...options,
  });
};

export const approveAffiliateUrls = async ({
  urls,
}: ApproveDenyAffiliateUrlProps) => {
  const response: AxiosResponse<void> = await api.patch(
    "/affiliate-urls/approve",
    {
      urls,
    }
  );
  return response.data;
};

export const useApproveAffiliateUrlsMutation = ({
  options,
}: {
  options: UseMutationOptions<void, AxiosError, ApproveDenyAffiliateUrlProps>;
}) => {
  return useMutation({
    mutationKey: ["approve-affiliate-urls"],
    mutationFn: (data) => approveAffiliateUrls(data),
    ...options,
  });
};

export const denyAffiliateUrls = async ({
  urls,
}: ApproveDenyAffiliateUrlProps) => {
  const response: AxiosResponse<void> = await api.patch(
    "/affiliate-urls/deny",
    {
      urls,
    }
  );
  return response.data;
};

export const useDenyAffiliateUrlsMutation = ({
  options,
}: {
  options: UseMutationOptions<void, AxiosError, ApproveDenyAffiliateUrlProps>;
}) => {
  return useMutation({
    mutationKey: ["deny-affiliate-urls"],
    mutationFn: (data) => denyAffiliateUrls(data),
    ...options,
  });
};
