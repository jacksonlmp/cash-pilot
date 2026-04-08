const FALLBACK_API_URL = "http://localhost:8001/api";

export const httpConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? FALLBACK_API_URL,
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      (payload as { detail?: string } | null)?.detail ?? "Request failed.",
      response.status,
    );
  }

  return payload as T;
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${httpConfig.baseUrl}${path}`);
  return readJson<T>(response);
}

export async function postJson<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(`${httpConfig.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return readJson<TResponse>(response);
}
