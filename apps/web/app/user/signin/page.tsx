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
        <div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSignin}>Sign in</button>
            {message && <p>{message}</p>}
        </div>
    );
}