"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
                maxPoints: Number(maxPoints),
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
        <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
            <Link
                href="/admin"
                className="text-text-secondary hover:text-accent transition-colors text-sm"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold mt-6 mb-2 text-text-primary">Standalone Challenges</h1>
            <p className="text-text-secondary mb-8">
                Challenges created here can be reused across multiple contests.
            </p>

            {/* Create challenge form */}
            <div className="bg-bg-card border border-border rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Create New Challenge</h2>
                <div className="flex flex-col gap-3">
                    <input
                        placeholder="Challenge Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <div className="flex gap-3">
                        <input
                            placeholder="Notion Doc ID"
                            value={notionDocId}
                            onChange={(e) => setNotionDocId(e.target.value)}
                            className="flex-1 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                        <input
                            placeholder="Max Points"
                            type="number"
                            value={maxPoints}
                            onChange={(e) => setMaxPoints(Number(e.target.value))}
                            className="w-32 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreateChallenge}
                        className="self-start bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent-glow cursor-pointer"
                    >
                        + Create Challenge
                    </button>
                </div>
            </div>

            {/* Created challenges list */}
            {challenges.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold text-text-primary mb-4">Recently Created</h2>
                    <div className="flex flex-col gap-3">
                        {challenges.map((ch) => (
                            <div
                                key={ch.id}
                                className="bg-bg-card border border-border rounded-xl px-6 py-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-text-primary">{ch.title}</h3>
                                    <span className="bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full">
                                        {ch.maxPoints} pts
                                    </span>
                                </div>
                                <p className="text-sm text-text-muted mt-1 font-mono">ID: {ch.id}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
