"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminSigninPost() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState("Logging you in as admin...");

    useEffect(() => {
        const emailToken = searchParams.get("token");
        if (!emailToken) {
            setMessage("Invalid or missing token.");
            return;
        }

        // Exchange the email token for an admin session JWT
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/signin/post?token=${emailToken}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("adminToken", data.token);
                    router.push("/admin");
                } else {
                    setMessage("Login failed. You might not be an admin.");
                }
            })
            .catch(() => setMessage("Something went wrong."));
    }, []);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}
