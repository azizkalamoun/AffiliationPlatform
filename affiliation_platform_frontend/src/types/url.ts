export type Url ={
  id: string;
  url: string;
  CompanyName: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
}

export type createUrlProps = {
  url: string;
  CompanyName: string;
  Description: string;
}

export type updateUrlProps ={
  id: string;
  url: string;
  CompanyName: string;
  Description: string;
}
