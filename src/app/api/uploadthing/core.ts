import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAdmin } from "@/lib/session";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      await requireAdmin();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url ?? file.ufsUrl,
        key: file.key,
      };
    }),

  editorUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      await requireAdmin();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url ?? file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
