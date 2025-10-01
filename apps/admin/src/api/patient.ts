import { swrOptions } from "@/utils/swr-options";
import { Patient, PatientInvoice, RecentPatient } from "@repo/entities";
import { CreateOrUpdatePatientType } from "@repo/schemas";
import useSWR, { mutate } from "swr";
import { fetcher, getRequest, postRequest } from ".";
import { getData } from "./index";

export function usePatients() {
  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: patientsMutate,
  } = useSWR("/patient", fetcher<Patient[]>, swrOptions);

  return {
    patientsData: data,
    patientsLoading: isLoading,
    patientsError: error,
    patientsValidating: isValidating,
    patientsMutate,
    patientsEmpty: !isLoading && !data?.length,
  };
}

export function usePatient(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/patient/${id}`,
    fetcher<PatientInvoice>,
    swrOptions
  );

  return {
    patientData: data,
    patientLoading: isLoading,
    patientError: error,
    patientValidating: isValidating,
    patientMutate: mutate,
  };
}

export function useRecentPatient() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    "/patient/recent",
    fetcher<RecentPatient[]>,
    swrOptions
  );

  return {
    patientsData: data || [],
    patientsLoading: isLoading,
    patientsError: error,
    patientsValidating: isValidating,
    patientsMutate: mutate,
    patientsEmpty: !isLoading && !data?.length,
  };
}

export async function getPatient(id: string) {
  const patient = getData<Patient>(
    await getRequest<Patient>({
      path: `/patient/${id}`,
    })
  );
  return patient;
}

export async function createPatient(dto: CreateOrUpdatePatientType) {
  const patient = getData<Patient>(
    await postRequest({
      path: "/patient",
      data: dto,
    })
  );

  mutate<Patient[]>("/patient", (v) => {
    if (!v) return [];
    return [...v, patient];
  });
}

export async function updatePatient(
  id: string,
  data: CreateOrUpdatePatientType
) {
  // works on server
  // await postRequest({ path: `/patient/${id}`, data });

  mutate<Patient[]>("/patient", (v) =>
    (v || []).map((patient) => {
      if (patient.id !== id) return patient;
      return {
        id: "asd",
        name: data.name,
        age: data.age,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        createdAt: new Date(),
      };
    })
  );
}

export async function deletePatient(patient: Patient) {
  // works on server
  // await deleteRequest({ path: `/patient/${patient.id}` });

  // works on client
  mutate<Patient[]>(
    "/patient",
    (oldValue) => {
      const newPatient = (oldValue || []).filter((p) => p.id !== patient.id);
      return newPatient;
    },
    {
      revalidate: false,
    }
  );
}
