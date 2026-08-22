const API_BASE = "/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

async function parseDetail(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail.length > 0 && typeof body.detail[0]?.msg === "string") {
      return body.detail[0].msg;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && !path.startsWith("/auth/login") && !path.startsWith("/auth/register")) {
      localStorage.removeItem("access_token");
      const pathname = window.location.pathname;
      if (pathname !== "/login" && pathname !== "/register" && !pathname.startsWith("/preview")) {
        window.location.href = "/login";
      }
    }
    throw new ApiError(await parseDetail(res, res.statusText || "Request failed"), res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
