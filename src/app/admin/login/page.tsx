import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="narrow page" style={{ maxWidth: 480 }}>
      <h1 className="title">Admin</h1>
      <LoginForm />
    </div>
  );
}
