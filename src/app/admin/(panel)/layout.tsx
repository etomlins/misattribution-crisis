import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="wrap page" style={{ gap: 28 }}>
      <nav className="admin-nav" aria-label="Admin">
        <span className="label">Admin</span>
        <Link href="/admin">Inbox</Link>
        <Link href="/admin/entries">Entries</Link>
        <Link href="/admin/entries/new">New entry</Link>
        <span style={{ flex: 1 }} />
        <form action={logout}>
          <button type="submit" className="btn-quiet">
            Log out
          </button>
        </form>
      </nav>
      <Suspense fallback={<p className="skeleton">Loading…</p>}>{children}</Suspense>
    </div>
  );
}
