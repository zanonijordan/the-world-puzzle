import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/session";
import { handleAdminApiError } from "@/app/api/admin/_utils";

export async function GET() {
  try {
    const session = await requireMember();

    const likes = await prisma.postLike.findMany({
      where: {
        userId: session.user.id,
        post: {
          status: "PUBLISHED",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            categories: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(likes.map((like) => like.post));
  } catch (error) {
    return handleAdminApiError(error);
  }
}
