import { swrOptions } from "@/utils/swr-options";
import { UserPermission } from "@repo/entities";
import { CreateOrUpdatePermissionType } from "@repo/schemas";
import useSWR from "swr";
import { fetcher, getData, getRequest, patchRequest } from ".";

export function usePermission(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/user/${id}/permission`,
    fetcher<UserPermission>,
    swrOptions
  );

  return {
    permissionData: data,
    permissionLoading: isLoading,
    permissionError: error,
    permissionValidating: isValidating,
    permissionMutate: mutate,
  };
}

export async function getPermission(id: string) {
  return getData<UserPermission>(
    await getRequest({ path: `/user/${id}/permission` })
  );
}

export async function updatePermission(
  userId: string,
  id: string,
  data: CreateOrUpdatePermissionType
) {
  await patchRequest<never, CreateOrUpdatePermissionType>({
    path: `/user/${userId}/permission/${id}`,
    data,
  });
}
