import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

import { handleAdminApiError } from "../../_utils";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const inputSlug = String(body?.slug ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    const slug = inputSlug || slugify(name);

    try {
      const category = await prisma.category.update({
        where: { id },
        data: { name, slug },
      });

      return NextResponse.json(category);
    } catch {
      return NextResponse.json(
        { error: "Não foi possível atualizar categoria." },
        { status: 400 },
      );
    }
  } catch (error) {
    return handleAdminApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    try {
      await prisma.category.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Não foi possível remover categoria." },
        { status: 400 },
      );
    }
  } catch (error) {
    return handleAdminApiError(error);
  }
}
