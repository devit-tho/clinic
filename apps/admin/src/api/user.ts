import {
  LoginResponse,
  UserResponse,
  UserWithoutPassword,
} from "@repo/entities";
import {
  ChangePasswordType,
  CreateUserType,
  LoginType,
  ResetPasswordType,
  UpdateUserType,
} from "@repo/schemas";
import { useMemo } from "react";
import useSWR, { mutate } from "swr";
import {
  deleteRequest,
  fetcher,
  getData,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from ".";

export function useUsers() {
  const { data, isLoading, error } = useSWR(
    "/user",
    fetcher<UserWithoutPassword[]>
  );

  const memoizedValue = useMemo(
    () => ({
      datas: data,
      loading: isLoading,
      error: error,
    }),
    [data, isLoading, error]
  );

  return memoizedValue;
}

export function useUser(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/user/${id}`,
    fetcher<UserWithoutPassword>
  );

  return {
    userData: data,
    userLoading: isLoading,
    userError: error,
    userValidating: isValidating,
    userMutate: mutate,
  };
}

export async function getUser(id: string) {
  return getData<UserWithoutPassword>(
    await getRequest({
      path: `/user/${id}`,
    })
  );
}

export async function createUser(dto: CreateUserType) {
  // works on server
  const res = getData<UserResponse>(
    await postRequest<UserResponse, CreateUserType>({
      path: "/user",
      data: dto,
    })
  );

  // works on local
  mutate<UserWithoutPassword[]>("/user", (v) => {
    return v;
  });

  return res;
}

export async function login(dto: LoginType) {
  const res = await postRequest<LoginResponse, LoginType>({
    path: "/auth/login",
    data: dto,
  });
  return res;
}

export async function logout() {
  await deleteRequest<string, LoginType>({
    path: "/auth/logout",
  });
}

export async function getCurrentUser() {
  const user = await getRequest<UserWithoutPassword>({
    path: "/auth/current-user",
  });
  return user;
}

export async function updateCurrentUser(dto: UpdateUserType) {
  await putRequest<never, UpdateUserType>({
    path: "/auth/current-user",
    data: dto,
  });
}

export async function updateUser(id: string, dto: UpdateUserType) {
  await patchRequest<UserWithoutPassword, UpdateUserType>({
    path: `/user/${id}`,
    data: dto,
  });
}

export async function deleteUser(id: string) {
  await deleteRequest<never, void>({
    path: `/user/${id}`,
  });
}

export async function resetPassword(dto: ResetPasswordType) {
  await postRequest<never, ResetPasswordType>({
    path: "/user/reset-password",
    data: dto,
  });
}

export async function changePassword(dto: ChangePasswordType) {
  await putRequest<never, ChangePasswordType>({
    path: "/user/change-password",
    data: dto,
  });
}
