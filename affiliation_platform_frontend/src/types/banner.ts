export type Banner = {
  id: string;
  src: string;
  urlId: string;
};

export type createBannerProps = {
  files: File[];
  urlId: string;
};
