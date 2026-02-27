"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const initialSignup = {
  name: "",
  email: "",
  password: "",
  gender: "MALE",
  age: "",
  phone: "",
};

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signup, setSignup] = useState(initialSignup);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      mode: "login",
      email: loginEmail,
      password: loginPassword,
      callbackUrl: "/auth/post-login",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid credentials.");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      mode: "signup",
      ...signup,
      callbackUrl: "/auth/post-login",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Signup failed. Check your details or use a different email.");
      return;
    }

    toast.success("Account created successfully.");
    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl items-center px-6 py-10">
      <section className="card w-full animate-fade-in p-8">
        <h1 className="text-3xl font-black tracking-tight text-ink">Welcome to GAITTRIB</h1>
        <p className="mt-2 text-sm text-slate-600">Compete with your community through structured events and live rankings.</p>

        <div className="mt-6 flex rounded-xl bg-slate-100 p-1 text-sm font-semibold">
          <button
            onClick={() => setMode("login")}
            className={`w-full rounded-lg px-3 py-2 ${mode === "login" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`w-full rounded-lg px-3 py-2 ${mode === "signup" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"}`}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              required
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
            <button disabled={loading} className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mt-6 grid gap-3">
            <input
              required
              placeholder="Full Name"
              value={signup.name}
              onChange={(event) => setSignup((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-3"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={signup.email}
              onChange={(event) => setSignup((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-3"
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Password"
              value={signup.password}
              onChange={(event) => setSignup((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                value={signup.gender}
                onChange={(event) => setSignup((prev) => ({ ...prev, gender: event.target.value }))}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                required
                type="number"
                min={10}
                max={100}
                placeholder="Age"
                value={signup.age}
                onChange={(event) => setSignup((prev) => ({ ...prev, age: event.target.value }))}
                className="rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>
            <input
              required
              placeholder="Phone"
              value={signup.phone}
              onChange={(event) => setSignup((prev) => ({ ...prev, phone: event.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-3"
            />
            <button disabled={loading} className="rounded-xl bg-brand-500 py-3 font-semibold text-white">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="my-6 h-px bg-slate-200" />

        <button
          onClick={() => signIn("google", { callbackUrl: "/auth/post-login" })}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:border-brand-100 hover:text-brand-700"
        >
          Continue with Google
        </button>
      </section>
    </main>
  );
}
