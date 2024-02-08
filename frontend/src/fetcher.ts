import { APIResponse } from "@/shared/types";
import ky from "ky";
import { getBaseURL } from "./util";

const baseURL = getBaseURL();

interface APIClient<Response = object> {
  get: <T extends Response>(path: string) => Promise<T>;
  post: <T extends Response>(path: string, jsonbody: object) => Promise<T>;
  delete: <T extends Response>(path: string) => Promise<T>;
  patch: <T extends Response>(path: string, jsonbody: object) => Promise<T>;
}

const fetcher: APIClient<APIResponse> = {
  get: <T extends APIResponse>(path: string) =>
    ky.get(baseURL + path).json<T>(),
  post: <T extends APIResponse>(path: string, jsonbody: object) =>
    ky.post(baseURL + path, { json: jsonbody }).json<T>(),
  delete: <T extends APIResponse>(path: string) =>
    ky.delete(baseURL + path).json<T>(),
  patch: <T extends APIResponse>(path: string, jsonbody: object) =>
    ky.patch(baseURL + path, { json: jsonbody }).json<T>(),
};

export default fetcher;
