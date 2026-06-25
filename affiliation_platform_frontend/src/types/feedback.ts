export type Feedback = {
  id: string;
  subject: string;
  object: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type createFeedbackProps = {
  subject: string;
  object: string;
  userId: string;
};

export type updateFeedbackProps = {
  id: string;
  subject: string;
  object: string;
  userId: string;
};
