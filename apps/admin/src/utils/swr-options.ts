import { SWRConfiguration } from "swr";

export const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  // revalidateOnMount: false,
};
