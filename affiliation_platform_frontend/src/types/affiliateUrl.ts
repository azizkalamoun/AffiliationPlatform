export type AffiliateUrl = {
  affiliate_id: string;
  url_id: string;
  status: string;
};

export type FetchUrlsOfUserResponse = {
  success: true;
  data: {
    affiliate_id: string;
    url_id: string;
    status: string;
    url: string;
    CompanyName: string;
    Description: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type CreateAffiliateUrlProps = {
  affiliateId: string;
  urlId: string;
};

export type UpdateAffiliateUrlProps = {
  affiliateId: string;
  urlId: string;
  status: string;
};

export type DeleteAffiliateUrlProps = {
  affiliateId: string;
  urlId: string;
};
export type ApproveDenyAffiliateUrlProps = {
  urls: { affiliate_id: string; url_id: string }[];
};

export type item = {
  affiliate_id: string;
  url_id: string;
  status: string;
  url: string;
  CompanyName: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
};
