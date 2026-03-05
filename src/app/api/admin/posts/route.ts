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

export async function GET() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await requireAdmin();

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
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        videoUrl,
        status,
        authorId: session.user.id,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
        tags: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível criar post." }, { status: 400 });
  }
}
