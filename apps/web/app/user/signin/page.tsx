"use client";

import { useState } from "react";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSignin() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("Check your email for a login link.");
        } else {
            setMessage(data.message ?? "Something went wrong.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        Sign In
                    </h1>
                    <p className="text-text-secondary mt-2 text-sm">Enter your email to receive a login link</p>
                </div>

                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                />

                <button
                    onClick={handleSignin}
                    className="w-full mt-4 bg-accent hover:bg-accent-hover text-accent-text font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer"
                >
                    Send Magic Link
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-green">{message}</p>
                )}
            </div>
        </div>
    );
}