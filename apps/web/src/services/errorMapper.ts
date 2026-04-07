import { ApiError } from "@/services/http";

export function mapErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel carregar este conteudo agora.";
}
