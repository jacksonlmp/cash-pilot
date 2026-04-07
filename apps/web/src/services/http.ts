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
