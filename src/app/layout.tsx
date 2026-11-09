import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/noto-sans";
import "./globals.css";
import { Suspense } from "react";
import { NavLinks, SiteNav } from "@/components/site-nav";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="site-name">
              {SITE_NAME}
            </Link>
            <Suspense fallback={<NavLinks pathname={null} />}>
              <SiteNav />
            </Suspense>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <span>© Ellen Tomlins</span>
            <nav aria-label="Footer">
              <Link href="/how-i-verify">How I verify</Link>
              <Link href="/submit">Submit</Link>
              <Link href="/info">Info</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
