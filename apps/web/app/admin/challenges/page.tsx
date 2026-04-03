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

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/challenge`, {
            headers: { Authorization: token },
        })
            .then((res) => res.json())
            .then((data) => {
                setChallenges(data.challenges ?? []);
            })
            .catch(() => { });
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
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <Link href="/admin" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                ← Dashboard
            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary mt-6 mb-2">Challenges</h1>
            <p className="text-text-secondary mb-10 text-sm">
                Create challenges to be reused across contests.
            </p>

            {/* Create form */}
            <div className="border border-border rounded-2xl p-6 mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    New Challenge
                </h2>
                <div className="flex flex-col gap-3">
                    <input
                        placeholder="Challenge Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                    />
                    <div className="flex gap-3">
                        <input
                            placeholder="Notion Doc ID"
                            value={notionDocId}
                            onChange={(e) => setNotionDocId(e.target.value)}
                            className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                        />
                        <input
                            placeholder="Points"
                            type="number"
                            value={maxPoints}
                            onChange={(e) => setMaxPoints(Number(e.target.value))}
                            className="w-28 bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreateChallenge}
                        className="self-start bg-accent hover:bg-accent-hover text-accent-text font-medium px-6 py-3 rounded-full transition-all duration-200 cursor-pointer"
                    >
                        Create Challenge
                    </button>
                </div>
            </div>

            {/* Created list */}
            {challenges.length > 0 && (
                <>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                        All Challenges
                    </h2>
                    <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
                        {challenges.map((ch) => (
                            <div key={ch.id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-text-primary">{ch.title}</span>
                                    <span className="text-sm text-text-secondary">{ch.maxPoints} pts</span>
                                </div>
                                <p className="text-xs text-text-muted font-mono mt-1">{ch.id}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
