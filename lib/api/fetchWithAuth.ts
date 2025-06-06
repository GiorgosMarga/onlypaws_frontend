import { StatusCodes } from "http-status-codes";
import { refreshToken } from "./user";

export const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}, retry = true, setContent = true): Promise<Response> => {
    const headers: HeadersInit = {
    ...(setContent ? { "Content-Type": "application/json" } : {}),
    ...(init.headers || {})
  };
    const res = await fetch(input, {
        ...init,
        credentials: "include",
        headers: Object.keys(headers).length > 0 ? headers : undefined
    });

    if (res.status === StatusCodes.UNAUTHORIZED && retry) {
        const refreshed = await refreshToken();
        if (refreshed) {
            // Retry the original request once
            return await fetchWithAuth(input, init, false);
        }
    }

    return res;
};