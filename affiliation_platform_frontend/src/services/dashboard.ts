import api from "@/api";
import { User, Subscription, Url } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const fetchAffiliatesCount = async (): Promise<{
  affiliates: {
    rows: User[];
    count: number;
  };
  percentageChange: number;
}> => {
  const response: AxiosResponse<{
    affiliates: {
      rows: User[];
      count: number;
    };
    percentageChange: number;
  }> = await api.get("/dashboard/affiliate-count");
  return response.data;
};

export const useFetchAffiliatesCountQuery = (
  options?: any
): UseQueryResult<
  {
    affiliates: {
      rows: User[];
      count: number;
    };
    percentageChange: number;
  },
  AxiosError
> => {
  return useQuery<
    {
      affiliates: {
        rows: User[];
        count: number;
      };
      percentageChange: number;
    },
    AxiosError
  >({
    queryKey: ["affiliatesCount"],
    queryFn: fetchAffiliatesCount,
    ...options,
  });
};
export const fetchLatestUsers = async (): Promise<User[]> => {
  const response: AxiosResponse<{
    success: boolean;
    data: User[];
  }> = await api.get("/dashboard/latest-users");
  return response.data.data;
};

export const useFetchLatestUsersQuery = (
  options?: any
): UseQueryResult<User[], AxiosError> => {
  return useQuery<User[], AxiosError>({
    queryKey: ["fetchLatestUsers"],
    queryFn: fetchLatestUsers,
    ...options,
  });
};

export const fetchLatestSubscriptions = async (
  affiliateId?: string,
  urlId?: string
): Promise<(Subscription & { url: Url; affiliate: User; sub: User })[]> => {
  let apiUrl = "/dashboard/latest-subscriptions";
  if (affiliateId || urlId) {
    apiUrl += "?";
    if (affiliateId) apiUrl += `affiliateId=${affiliateId}&`;
    if (urlId) apiUrl += `urlId=${urlId}&`;
  }
  const response: AxiosResponse<{
    success: boolean;
    data: (Subscription & { url: Url; affiliate: User; sub: User })[];
  }> = await api.get(apiUrl);
  return response.data.data;
};

export const useFetchLatestSubscriptionsQuery = (
  affiliateId?: string,
  urlId?: string,
  options?: any
): UseQueryResult<
  (Subscription & { url: Url; affiliate: User; sub: User })[],
  AxiosError
> => {
  return useQuery<
    (Subscription & { url: Url; affiliate: User; sub: User })[],
    AxiosError
  >({
    queryKey: ["fetchLatestSubscriptions", affiliateId, urlId],
    queryFn: () => fetchLatestSubscriptions(affiliateId, urlId),
    ...options,
  });
};

export const fetchAffiliateClicksByUrl = async (
  affiliateId?: string,
  urlId?: string
): Promise<{ success: boolean; count: number; percentageChange: string }> => {
  const response: AxiosResponse<{
    success: boolean;
    count: number;
    percentageChange: string;
  }> = await api.get("/dashboard/affiliate-clicks-by-url", {
    params: { affiliateId, urlId },
  });
  return response.data;
};

export const useFetchAffiliateClicksByUrlQuery = (
  affiliateId?: string,
  urlId?: string,
  options?: any
): UseQueryResult<
  { success: boolean; count: number; percentageChange: string },
  AxiosError
> => {
  return useQuery<
    { success: boolean; count: number; percentageChange: string },
    AxiosError
  >({
    queryKey: ["affiliateClicksByUrl", affiliateId, urlId],
    queryFn: () => fetchAffiliateClicksByUrl(affiliateId, urlId),
    ...options,
  });
};

export const fetchAffiliateSubscriptionsByUrl = async (
  affiliateId?: string,
  urlId?: string
): Promise<{ success: boolean; count: number; percentageChange: string }> => {
  const response: AxiosResponse<{
    success: boolean;
    count: number;
    percentageChange: string;
  }> = await api.get("/dashboard/affiliate-subscriptions-by-url", {
    params: { affiliateId, urlId },
  });
  return response.data;
};

export const useFetchAffiliateSubscriptionsByUrlQuery = (
  affiliateId?: string,
  urlId?: string,
  options?: any
): UseQueryResult<
  { success: boolean; count: number; percentageChange: string },
  AxiosError
> => {
  return useQuery<
    { success: boolean; count: number; percentageChange: string },
    AxiosError
  >({
    queryKey: ["affiliateSubscriptionsByUrl", affiliateId, urlId],
    queryFn: () => fetchAffiliateSubscriptionsByUrl(affiliateId, urlId),
    ...options,
  });
};

export const fetchAffiliateAdvertisedUrls = async (
  affiliateId?: string
): Promise<{ urls: Url[]; count: number }> => {
  const response: AxiosResponse<{
    success: boolean;
    data: Url[];
    count: number;
  }> = await api.get("/dashboard/affiliate-advertised-urls", {
    params: { affiliateId },
  });
  return { urls: response.data.data, count: response.data.count };
};

export const useFetchAffiliateAdvertisedUrlsQuery = (
  affiliateId?: string,
  options?: any
): UseQueryResult<{ urls: Url[]; count: number }, AxiosError> => {
  return useQuery<{ urls: Url[]; count: number }, AxiosError>({
    queryKey: ["affiliateAdvertisedUrls", affiliateId],
    queryFn: () => fetchAffiliateAdvertisedUrls(affiliateId),
    ...options,
  });
};
