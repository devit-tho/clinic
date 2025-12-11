import { Treatment } from "@repo/entities";
import { CreateOrUpdateTreatmentType } from "@repo/schemas";
import { useMemo } from "react";
import useSWR, { mutate } from "swr";
import { fetcher, getData, getRequest, postRequest } from ".";

export function useTreatments() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    "/treatment",
    fetcher<Treatment[]>
  );

  const memoizedTreatments = useMemo(
    () => ({
      treatmentsData: data || [],
      treatmentsLoading: isLoading || isValidating,
      treatmentsError: error,
      treatmentsMutate: mutate,
      treatmentsEmpty: !isLoading && !data?.length,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedTreatments;
}

export function useTreatment(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/treatment/${id}`,
    fetcher<Treatment>
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

export async function getTreatment(id: string) {
  const treatment = getData<Treatment>(
    await getRequest({
      path: `/treatment/${id}`,
    })
  );
  return treatment;
}

export async function createTreatment(data: CreateOrUpdateTreatmentType) {
  // works on server
  const res = await postRequest<{ id: string }, CreateOrUpdateTreatmentType>({
    path: "/treatment",
    data,
  });

  const newData = {
    id: res.data.id,
    price: data.price,
    type: data.type,
    createdAt: new Date(),
  };

  // works on local
  mutate<Treatment[]>("/treatment", (v) => {
    if (!v) return;
    return [...v, newData];
  });
}

export async function updateTreatment(
  id: string,
  data: CreateOrUpdateTreatmentType
) {
  await postRequest({ path: `/treatment/${id}`, data });

  mutate<Treatment[]>("/treatment", (v) =>
    (v || []).map((treatment) => {
      if (treatment.id !== id) return treatment;
      return {
        ...treatment,
        price: data.price,
        type: data.type,
      };
    })
  );
}

export async function deleteTreatment(treatment: Treatment) {
  // works on server
  // await deleteRequest({ path: `/treatment/${treatment.id}` });

  // works on local
  mutate<Treatment[]>("/treatment", (datas) =>
    (datas || []).filter((d) => d.id !== treatment.id)
  );
}
