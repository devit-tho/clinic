import { swrOptions } from "@/utils/swr-options";

import { Invoice, InvoiceDetail, InvoiceDetailPatient } from "@repo/entities";
import {
  CreateOrUpdateInvoiceDetailType,
  CreateOrUpdateInvoiceType,
} from "@repo/schemas";
import useSWR, { mutate } from "swr";
import { deleteRequest, fetcher, getData, getRequest, postRequest } from ".";

export function useInvoices() {
  const { data, isLoading, error } = useSWR(
    "/invoice",
    fetcher<InvoiceDetailPatient[]>,
    swrOptions
  );

  return {
    datas: data || [],
    loading: isLoading,
    error: error,
  };
}

export function useInvoice(id: string) {
  const { data, isLoading, error, mutate, isValidating } = useSWR(
    `/invoice/${id}`,
    fetcher<InvoiceDetail>,
    swrOptions
  );

  return {
    invoiceData: data,
    invoiceLoading: isLoading,
    invoiceError: error,
    invoiceValidating: isValidating,
    invoiceMutate: mutate,
  };
}

export function useInvoiceNo(id?: string) {
  const { data, isLoading, error, mutate, isValidating } = useSWR(
    id ? `/invoice/${id}/inv-no` : "/invoice/inv-no",
    fetcher<string>,
    swrOptions
  );

  return {
    invoiceNoData: data,
    invoiceNoLoading: isLoading,
    invoiceNoError: error,
    invoiceNoValidating: isValidating,
    invoiceNoMutate: mutate,
    invoiceNoEmpty: !isLoading && !data,
  };
}

export async function getInvoice(id: string) {
  return getData<Invoice>(
    await getRequest<Invoice>({
      path: `/invoice/${id}`,
    })
  );
}

export async function createInvoice(data: CreateOrUpdateInvoiceType) {
  const invoice = getData<string>(
    await postRequest({
      path: "/invoice",
      data,
    })
  );

  return invoice;
}

export async function createInvoiceWithDetails(
  data: CreateOrUpdateInvoiceDetailType
) {
  // return postRequest({
  //   path: "/invoice/detail",
  //   data,
  // });
  return data;
}

export async function deleteInvoice(invoice: Invoice) {
  // works on server
  await deleteRequest({ path: `/invoice/${invoice.id}` });

  // works on local
  mutate<Invoice[]>("/invoice", (datas) =>
    (datas || []).filter((d) => d.id !== invoice.id)
  );
}

export async function deleteAllDetail(invoiceId: string) {
  return await deleteRequest({ path: `/invoice/${invoiceId}/detail` });
}
