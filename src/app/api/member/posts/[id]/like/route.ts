import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/session";
import { handleAdminApiError } from "@/app/api/admin/_utils";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireMember();
    const { id } = await context.params;

    const post = await prisma.post.findFirst({
      where: { id, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado ou não publicado." }, { status: 404 });
    }

    await prisma.postLike.upsert({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id,
        },
      },
      create: {
        userId: session.user.id,
        postId: id,
      },
      update: {},
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleAdminApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireMember();
    const { id } = await context.params;

    await prisma.postLike.deleteMany({
      where: {
        userId: session.user.id,
        postId: id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
