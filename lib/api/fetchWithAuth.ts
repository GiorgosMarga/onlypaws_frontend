import { StatusCodes } from "http-status-codes";
import { refreshToken } from "./user";

export const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> => {
    const res = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
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