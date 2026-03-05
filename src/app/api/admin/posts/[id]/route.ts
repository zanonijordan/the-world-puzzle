import { PostStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

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
  await requireAdmin();
  const { id } = await context.params;

  const body = await request.json();
  const title = String(body?.title ?? "").trim();
  const inputSlug = String(body?.slug ?? "").trim();
  const excerpt = String(body?.excerpt ?? "").trim() || null;
  const content = String(body?.content ?? "").trim();
  const coverImage = String(body?.coverImage ?? "").trim() || null;
  const videoUrl = String(body?.videoUrl ?? "").trim() || null;
  const status =
    body?.status === PostStatus.PUBLISHED ? PostStatus.PUBLISHED : PostStatus.DRAFT;

  const categoryIds = Array.isArray(body?.categoryIds)
    ? body.categoryIds.map((value: unknown) => String(value))
    : [];
  const tagIds = Array.isArray(body?.tagIds)
    ? body.tagIds.map((value: unknown) => String(value))
    : [];

  if (!title || !content) {
    return NextResponse.json({ error: "Título e conteúdo são obrigatórios." }, { status: 400 });
  }

  const slug = inputSlug || slugify(title);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        videoUrl,
        status,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
        categories: {
          set: categoryIds.map((categoryId: string) => ({ id: categoryId })),
        },
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar post." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await context.params;

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível remover post." }, { status: 400 });
  }
}
