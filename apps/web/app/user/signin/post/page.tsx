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
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">{message}</p>
            </div>
        </div>
    );
}