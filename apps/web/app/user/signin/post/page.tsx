"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SigninPost() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState("Logging you in...");

    useEffect(() => {
        const emailToken = searchParams.get("token");
        if (!emailToken) {
            setMessage("Invalid or missing token.");
            return;
        }

        // Exchange the short-lived email token for a real session JWT
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signin/post?token=${emailToken}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    router.push("/contests");
                } else {
                    setMessage("Login failed. The link may have expired.");
                }
            })
            .catch(() => setMessage("Something went wrong. Please try again."));
    }, []);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}