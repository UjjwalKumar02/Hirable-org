import { API_BASE_URL } from "../config";

let refreshPromise: any = null;

export async function api(url: string, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 403) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshRes = await refreshPromise;

    if (!refreshRes.ok) {
      // refresh failed → logout
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/login";
      return res;
    }

    // retry original request
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return res;
}
