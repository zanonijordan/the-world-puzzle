import Link from "next/link";
import type { Session } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";

type SiteHeaderProps = {
  session: Session | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  const userName = session?.user?.name?.trim() || session?.user?.email || "Membro";
  const role = (session?.user?.role ?? "").toUpperCase();
  const isMember = !!session?.user && role === "MEMBER";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          THE WORLD PUZZLE
        </Link>

        <nav className="site-header__nav" aria-label="Navegação principal">
          {session?.user ? (
            <div className="site-header__auth">
              {isMember ? (
                <Link href="/member/saved-posts" className="site-header__cta site-header__cta--login">
                  Meus salvos
                </Link>
              ) : null}
              <span className="site-header__user" title={session.user.email ?? undefined}>
                {userName}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="site-header__auth">
              <Link href="/login" className="site-header__cta site-header__cta--login">
                Entrar
              </Link>
              <Link href="/register" className="site-header__cta site-header__cta--register">
                Criar conta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
