import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

import { handleAdminApiError } from "../_utils";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  try {
    await requireAdmin();

    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return handleAdminApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const inputSlug = String(body?.slug ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    const slug = inputSlug || slugify(name);

    try {
      const tag = await prisma.tag.create({
        data: { name, slug },
      });

      return NextResponse.json(tag, { status: 201 });
    } catch {
      return NextResponse.json(
        { error: "Não foi possível criar tag. Nome/slug pode já existir." },
        { status: 400 },
      );
    }
  } catch (error) {
    return handleAdminApiError(error);
  }
}
