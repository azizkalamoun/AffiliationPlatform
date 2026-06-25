import { ReactNode } from "react";
import { Url } from "./url";
import { User } from "./user";

export type Subscription = {
  userId: ReactNode;
  id: string;
  affiliateId: string;
  urlId: string;
  sub?: User;
  url?: Url;
  createdAt?: Date;
  updatedAt?: Date;
};

export type createSubscriptionProps = {
  affiliateId: string;
  urlId: string;
};

export type SubscriptionWithUserAndUrl = Subscription & {
  affiliate: User;
  sub: User;
  url: Url;
};
