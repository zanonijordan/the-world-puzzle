import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      categories: true,
      tags: {
        include: {
          tag: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      categories: true,
      tags: {
        include: {
          tag: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}
