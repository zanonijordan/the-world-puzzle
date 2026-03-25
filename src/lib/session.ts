import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  const role = (session.user.role ?? "").toUpperCase();
  if (role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return session;
}
