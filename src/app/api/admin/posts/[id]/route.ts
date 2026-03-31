import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

import { handleAdminApiError } from "../../_utils";

const utapi = new UTApi();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getUploadThingFileKey(fileUrl: string | null | undefined): string | null {
  if (!fileUrl) return null;

  try {
    const parsed = new URL(fileUrl);
    if (!parsed.hostname.includes("utfs.io")) return null;

    const key = parsed.pathname.split("/").filter(Boolean).pop();
    return key || null;
  } catch {
    return null;
  }
}

async function tryDeleteUploadThingFileByUrl(fileUrl: string | null | undefined) {
  const fileKey = getUploadThingFileKey(fileUrl);
  if (!fileKey) return;

  try {
    await utapi.deleteFiles(fileKey);
  } catch {
    // Non-blocking cleanup: falha de remoção do arquivo não impede operação do post
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const inputSlug = String(body?.slug ?? "").trim();
    const excerpt = String(body?.excerpt ?? "").trim() || null;
    const content = String(body?.content ?? "").trim();
    const coverImage = String(body?.coverImage ?? "").trim() || null;
    const videoUrl = String(body?.videoUrl ?? "").trim() || null;
    const status = body?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

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
      const existingPost = await prisma.post.findUnique({
        where: { id },
        select: { coverImage: true },
      });

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
          publishedAt: status === "PUBLISHED" ? new Date() : null,
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

      if (
        existingPost?.coverImage &&
        existingPost.coverImage !== coverImage
      ) {
        await tryDeleteUploadThingFileByUrl(existingPost.coverImage);
      }

      return NextResponse.json(post);
    } catch {
      return NextResponse.json({ error: "Não foi possível atualizar post." }, { status: 400 });
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
      const existingPost = await prisma.post.findUnique({
        where: { id },
        select: { coverImage: true },
      });

      if (existingPost?.coverImage) {
        await tryDeleteUploadThingFileByUrl(existingPost.coverImage);
      }

      await prisma.post.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Não foi possível remover post." }, { status: 400 });
    }
  } catch (error) {
    return handleAdminApiError(error);
  }
}
