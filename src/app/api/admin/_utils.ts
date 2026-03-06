import { NextResponse } from "next/server";

export function handleAdminApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }
  }

  return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
}
