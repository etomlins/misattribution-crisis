"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="stack gap-16">
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      <button type="submit" className="btn" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
