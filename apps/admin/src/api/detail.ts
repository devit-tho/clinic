import { CreateOrUpdateDetailType } from "@repo/schemas";
import { postRequest } from ".";

export async function getDetailByPatientIdAndInvoiceId(patientId: string) {
  return postRequest({
    path: `/detail/${patientId}`,
  });
}

export async function createDetail(data: CreateOrUpdateDetailType) {
  return postRequest({ path: "/detail", data });
}
