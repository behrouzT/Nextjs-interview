"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const SHOP_EMAIL = "tech@hearth.test";
const SHOP_PASSWORD = "bench-4242";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmailError = email.trim() === "" ? "Enter your email" : null;
    const nextPasswordError = password.trim() === "" ? "Enter your password" : null;
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setBanner(null);

    if (nextEmailError || nextPasswordError) return;

    if (email.trim() !== SHOP_EMAIL || password !== SHOP_PASSWORD) {
      setBanner("That email and password do not match.");
      return;
    }

    setSubmitting(true);
    router.push("/jobs");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-white px-4 py-10">
      <form
        onSubmit={submit}
        className="grid w-full max-w-sm gap-3 rounded-md bg-white p-4 shadow"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        {banner ? (
          <p role="alert" className="text-sm text-red-600">
            {banner}
          </p>
        ) : null}

        <label className="grid gap-1 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tech@hearth.test"
            autoComplete="email"
            className="h-9 rounded-sm border border-gray-300 px-2"
          />
          {emailError ? <span className="text-red-600">{emailError}</span> : null}
        </label>

        <label className="grid gap-1 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="h-9 rounded-sm border border-gray-300 px-2"
          />
          {passwordError ? <span className="text-red-600">{passwordError}</span> : null}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="h-9 rounded-md bg-zinc-900 text-sm text-white disabled:opacity-70"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
