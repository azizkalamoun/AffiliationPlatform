// login
export type loginProps = {
  email: string;
  password: string;
};

export type loginResponse = {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
  role: string;
};

// register
export type registerProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  occupation: string;
  age: string;
  gender: string;
  phoneNumber: string;
  country: string;
  ref?: string;
  baseUrl: string;
};

export type registerResponse = {
  success: boolean;
  message?: string;
};

// add
export type addProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  occupation: string;
  age: string;
  gender: string;
  phoneNumber: number;
  country: string;
  role: string;
  status: string;
};

// forgot password
export type forgotPasswordProps = {
  email: string;
};

export type forgotPasswordResponse = {
  success: boolean;
  message?: string;
};

// reset password
export type resetPasswordProps = {
  resetToken: string;
  newPassword: string;
};

export type resetPasswordResponse = {
  success: boolean;
  message?: string;
};

// user
export type User = {
  country: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  occupation: string;
  age: string;
  gender: string;
  phoneNumber: number;
  role: string;
  status: string;
};

export type GetUserByIdParams = {
  userId: string;
};

export type GetUserByIdResponse = {
  success: boolean;
  message?: string;
  user?: User;
};

// update user
export type UpdateUserProps = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  occupation: string;
  age: string;
  gender: string;
  phoneNumber: number;
  country?: string;
  password?: string;
  role?: string;
};

// approve registration
export type ApproveRegistrationProps = {
  affiliatesIds: string[];
};

// deny registration
export type DenyRegistrationProps = {
  affiliatesIds: string[];
};
