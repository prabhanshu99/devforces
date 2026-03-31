"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Challenge {
    id: string;
    title: string;
    notionDocId: string;
    maxPoints: number;
}

export default function ChallengesAdmin() {
    const router = useRouter();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [title, setTitle] = useState("");
    const [notionDocId, setNotionDocId] = useState("");
    const [maxPoints, setMaxPoints] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/signin");
            return;
        }

        // Just fetching all challenges (we might need a backend route for this)
        // For now, if no generic list_challenges, we focus on creation.
    }, []);

    async function handleCreateChallenge() {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/challenge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ?? "",
            },
            body: JSON.stringify({
                title,
                notionDocId,
                maxPoints: Number(maxPoints)
            }),
        });

        if (res.ok) {
            const data = await res.json();
            setChallenges([data.challenge, ...challenges]);
            setTitle("");
            setNotionDocId("");
            setMaxPoints(0);
        }
    }

    return (
        <div>
            <h1>Standalone Challenges</h1>
            <p>Challenges created here can be reused across multiple contests.</p>

            <section>
                <h2>Create New Challenge</h2>
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <input placeholder="Notion Doc ID" value={notionDocId} onChange={e => setNotionDocId(e.target.value)} />
                <input placeholder="Max Points" type="number" value={maxPoints} onChange={e => setMaxPoints(Number(e.target.value))} />
                <button onClick={handleCreateChallenge}>Create Challenge</button>
            </section>

            <hr />

            <section>
                <h2>Recent Challenges</h2>
                {challenges.map(ch => (
                    <div key={ch.id}>
                        <h3>{ch.title}</h3>
                        <p>Notion ID: {ch.notionDocId} | Points: {ch.maxPoints}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
