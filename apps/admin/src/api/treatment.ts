import { Treatment } from "@repo/entities";
import { CreateOrUpdateTreatmentType } from "@repo/schemas";
import { useMemo } from "react";
import useSWR from "swr";
import { deleteRequest, fetcher, getData, getRequest, postRequest } from ".";

export function useTreatments() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    "/treatment",
    fetcher<Treatment[]>,
  );

  const memoizedTreatments = useMemo(
    () => ({
      treatmentsData: data || [],
      treatmentsLoading: isLoading || isValidating,
      treatmentsError: error,
      treatmentsMutate: mutate,
      treatmentsEmpty: !isLoading && !data?.length,
    }),
    [data, isLoading, error, isValidating, mutate],
  );

  return memoizedTreatments;
}

export function useTreatment(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/treatment/${id}`,
    fetcher<Treatment>,
  );

  return {
    treatmentData: data,
    treatmentLoading: isLoading,
    treatmentError: error,
    treatmentValidating: isValidating,
    treatmentMutate: mutate,
    treatmentEmpty: !isLoading && !data,
  };
}

export async function getTreatment(id: string): Promise<Treatment> {
  return getData<Treatment>(
    await getRequest({
      path: `/treatment/${id}`,
    }),
  );
}

export async function createTreatment(
  data: CreateOrUpdateTreatmentType,
): Promise<void> {
  // works on server
  await postRequest<{ id: string }, CreateOrUpdateTreatmentType>({
    path: "/treatment",
    data,
  });
}

export async function updateTreatment(
  id: string,
  data: CreateOrUpdateTreatmentType,
): Promise<void> {
  await postRequest({ path: `/treatment/${id}`, data });
}

export async function deleteTreatment(treatment: Treatment): Promise<void> {
  await deleteRequest({ path: `/treatment/${treatment.id}` });
}
