import { swrOptions } from "@/utils/swr-options";
import { UserPermission } from "@repo/entities";
import { CreateOrUpdatePermissionType } from "@repo/schemas";
import { useMemo } from "react";
import useSWR from "swr";
import { fetcher, getData, getRequest, postRequest } from ".";

export function usePermissions(userId: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/user/${userId}/permissions`,
    fetcher<UserPermission>,
    swrOptions
  );

  const memoizedPermissions = useMemo(
    () => ({
      permissionsData: data || [],
      permissionsLoading: isLoading,
      permissionsError: error,
      permissionsValidating: isValidating,
      permissionsMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedPermissions;
}

export async function getPermissions(id: string) {
  return getData<UserPermission>(
    await getRequest({ path: `/user/${id}/permission` })
  );
}

export async function updatePermissions(
  userId: string,
  data: CreateOrUpdatePermissionType
) {
  await postRequest<never, CreateOrUpdatePermissionType>({
    path: `/user/${userId}/permissions`,
    data,
  });
}
