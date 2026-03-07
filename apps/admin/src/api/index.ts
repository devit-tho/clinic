import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Bowser from "bowser";
import capitalize from "lodash/capitalize";
import get from "lodash/get";

interface Request<D> {
  path: string;
  token?: string | null;
  data?: D;
  options?: AxiosRequestConfig;
}

type Response<T, D> = Promise<AxiosResponse<T, D>>;

type AxiosInstanceConfig = {
  token?: string | null;
  options: AxiosRequestConfig;
};

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const client = axios.create({
  baseURL: process.env.WEB_API,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

client.interceptors.request.use((config) => {
  const lang = localStorage.getItem("i18nextLng") || "en";
  config.headers["Accept-Language"] = lang;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError) {
      if (
        typeof error.response?.data?.message === "string" &&
        !!error.response?.data.statusCode
      ) {
        return Promise.reject(
          new ApiError(
            error.response?.data.statusCode,
            error.response.data.message,
          ),
        );
      }
      return Promise.reject(new Error("Unhandled API error"));
    }
    return Promise.reject(error);
  },
);

function axiosInstanceConfig(config: AxiosInstanceConfig) {
  const headers = get(config.options, `headers`) ? config.options.headers : {};
  const mappedHeaders = config.token
    ? {
        ...config.options,
        headers: { ...headers, Authorization: `Bearer ${config.token}` },
      }
    : config.options;

  const newHeaders = {
    ...mappedHeaders,
    headers: {
      ...(get(mappedHeaders, "headers") || {}),
    },
  };

  return newHeaders;
}

export function getDevice() {
  const { browser, os, platform } = Bowser.parse(window.navigator.userAgent);
  const platformType = capitalize(platform.type);
  const device = `${os.name} | ${platformType} | ${browser.name}`;
  return device;
}

export function getData<T>(response: AxiosResponse): T {
  return response.data;
}

export const fetcher = async <T>(url: string) =>
  getData<T>(await getRequest<T>({ path: url }));

export async function getRequest<T, D = any>(req: Request<D>): Response<T, D> {
  return client.get<T>(
    req.path,
    axiosInstanceConfig({ options: req.options || {}, token: req.token }),
  );
}

export async function postRequest<T, D>(req: Request<D>): Response<T, D> {
  return client.post<T>(
    req.path,
    req.data,
    axiosInstanceConfig({ options: req.options || {}, token: req.token }),
  );
}

export async function patchRequest<T, D>(req: Request<D>): Response<T, D> {
  return client.patch<T>(
    req.path,
    req.data,
    axiosInstanceConfig({ options: req.options || {}, token: req.token }),
  );
}

export async function putRequest<T, D>(req: Request<D>): Response<T, D> {
  return client.put<T>(
    req.path,
    req.data,
    axiosInstanceConfig({ options: req.options || {}, token: req.token }),
  );
}

export async function deleteRequest<T, D>(req: Request<D>): Response<T, D> {
  return client.delete(
    req.path,
    axiosInstanceConfig({ options: req.options || {}, token: req.token }),
  );
}

export default client;

export * from "./treatment";

export * from "./user";

export * from "./patient";
