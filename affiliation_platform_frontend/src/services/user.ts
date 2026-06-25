import api from "@/api";
import {
  ApproveRegistrationProps,
  DenyRegistrationProps,
  UpdateUserProps,
  User,
  addProps,
  forgotPasswordProps,
  forgotPasswordResponse,
  loginProps,
  loginResponse,
  registerProps,
  registerResponse,
  resetPasswordProps,
  resetPasswordResponse,
} from "@/types";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

// Login
export const login = async ({ email, password }: loginProps) => {
  const response: AxiosResponse<loginResponse> = await api.post("/login", {
    email,
    password,
  });
  return response.data;
};

export const useLoginMutation = ({
  options,
}: {
  options?: UseMutationOptions<loginResponse, AxiosError, loginProps>;
}) => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => login(data),
    ...options,
  });
};

// Register
export const register = async (props: registerProps) => {
  const response: AxiosResponse<registerResponse> = await api.post(
    `/register?ref=${props?.ref}`,
    {
      ...props,
    }
  );
  return response.data;
};

export const useRegisterMutation = ({
  options,
}: {
  options: UseMutationOptions<registerResponse, AxiosError, registerProps>;
}) => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data) => register(data),
    ...options,
  });
};

// add
export const add = async ({
  email,
  password,
  firstName,
  lastName,
  occupation,
  age,
  gender,
  phoneNumber,
  country,
  role,
  status,
}: addProps) => {
  const response: AxiosResponse<registerResponse> = await api.post(
    "/register",
    {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      occupation,
      age,
      gender,
      country,
      role,
      status,
    }
  );
  return response.data;
};

export const useAddMutation = ({
  options,
}: {
  options: UseMutationOptions<registerResponse, AxiosError, addProps>;
}) => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data) => add(data),
    ...options,
  });
};

// Forgot Password
export const forgotPassword = async ({ email }: forgotPasswordProps) => {
  const response: AxiosResponse<forgotPasswordResponse> = await api.post(
    "/forgot-password",
    { email }
  );
  return response.data;
};

export const useForgotPasswordMutation = ({
  options,
}: {
  options?: UseMutationOptions<
    forgotPasswordResponse,
    AxiosError,
    forgotPasswordProps
  >;
}) => {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (data: forgotPasswordProps) => forgotPassword(data),
    ...options,
  });
};

// Reset Password
export const resetPassword = async ({
  resetToken,
  newPassword,
}: resetPasswordProps) => {
  const response: AxiosResponse<resetPasswordResponse> = await api.put(
    "/reset-password",
    { resetToken, newPassword }
  );
  return response.data;
};

export const useResetPasswordMutation = ({
  options,
}: {
  options?: UseMutationOptions<
    resetPasswordResponse,
    AxiosError,
    resetPasswordProps
  >;
}) => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: resetPasswordProps) => resetPassword(data),
    ...options,
  });
};

// Fetch All Users
export const fetchAllUsers = async () => {
  const response: AxiosResponse<{
    success: boolean;
    data: User[];
  }> = await api.get("/users");
  return response.data;
};

export const useFetchAllUsersQuery = ({
  options,
}: {
  options?: UseQueryOptions<
    {
      success: boolean;
      data: User[];
    },
    AxiosError
  >;
}) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
    ...options,
  });
};

// Update User
export const updateUser = async ({
  id,
  email,
  password,
  firstName,
  lastName,
  occupation,
  age,
  gender,
  phoneNumber,
  country,
  role,
}: UpdateUserProps) => {
  const response: AxiosResponse<User> = await api.put(`/users/${id}/edit`, {
    email,
    password,
    firstName,
    lastName,
    occupation,
    age,
    gender,
    phoneNumber,
    country,
    role,
  });
  return response.data;
};

export const useUpdateUserMutation = ({
  options,
}: {
  options: UseMutationOptions<User, AxiosError, UpdateUserProps>;
}) => {
  return useMutation({
    mutationKey: ["update-user"],
    mutationFn: (data: UpdateUserProps) => updateUser(data),
    ...options,
  });
};

// Delete User
export const deleteUser = async (id: string) => {
  const response: AxiosResponse<void> = await api.delete(`/users/${id}/delete`);
  return response.data;
};

export const useDeleteUserMutation = ({
  options,
}: {
  options: UseMutationOptions<void, AxiosError, string>;
}) => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (id) => deleteUser(id),
    ...options,
  });
};

// Approve Registration
export const approveRegistration = async ({
  affiliatesIds,
}: ApproveRegistrationProps) => {
  const response: AxiosResponse<void> = await api.post(
    "/users/approve-registration",
    {
      affiliatesIds,
    }
  );
  return response.data;
};

export const useApproveRegistrationMutation = ({
  options,
}: {
  options: UseMutationOptions<void, AxiosError, ApproveRegistrationProps>;
}) => {
  return useMutation({
    mutationKey: ["approve-registration"],
    mutationFn: (data) => approveRegistration(data),
    ...options,
  });
};

// Deny Registration
export const denyRegistration = async ({
  affiliatesIds,
}: DenyRegistrationProps) => {
  const response: AxiosResponse<void> = await api.post(
    "/users/deny-registration",
    {
      affiliatesIds,
    }
  );
  return response.data;
};

export const useDenyRegistrationMutation = ({
  options,
}: {
  options: UseMutationOptions<void, AxiosError, DenyRegistrationProps>;
}) => {
  return useMutation({
    mutationKey: ["deny-registration"],
    mutationFn: (data) => denyRegistration(data),
    ...options,
  });
};
export const registerClick = async (ref: string) => {
  const response: AxiosResponse = await api.get("/register", {
    params: { ref },
  });
  return response.data;
};

export const useRegisterClick = (ref: string, options?: any) => {
  return useQuery({
    queryKey: ["/registerPageClick", ref],
    queryFn: () => registerClick(ref),
    ...options,
  });
};
