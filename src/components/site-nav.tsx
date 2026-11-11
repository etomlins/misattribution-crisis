"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/people", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/how-i-verify", label: "How I verify" },
  { href: "/info", label: "Info" },
];

/** The menu. `pathname` marks the current page; pass null when it isn't known yet. */
export function NavLinks({ pathname }: { pathname: string | null }) {
  const isCurrent = (href: string) => pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav className="site-nav" aria-label="Main">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
      <span className="nav-break" aria-hidden="true" />
      <Link href="/submit" className="nav-cta" aria-current={isCurrent("/submit") ? "page" : undefined}>
        <span className="nav-cta-mark" aria-hidden="true">
          “
        </span>
        Submit a misquote
      </Link>
    </nav>
  );
}

export function SiteNav() {
  return <NavLinks pathname={usePathname()} />;
}
