"use client";

import { useState } from "react";

export default function AdminSignin() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSignin() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/signin`, {
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
        <div>
            <h1>Admin Sign In</h1>
            <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSignin}>Sign in</button>
            {message && <p>{message}</p>}
        </div>
    );
}
