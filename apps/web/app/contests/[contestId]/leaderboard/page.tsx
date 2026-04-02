"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface LeaderboardEntry {
    rank: number;
    user: {
        id: string;
        email: string;
    };
}

export default function LeaderboardPage() {
    const { contestId } = useParams<{ contestId: string }>();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/leaderboard/${contestId}`)
            .then((res) => res.json())
            .then((data) => {
                setEntries(data.leaderboard ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [contestId]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <Link
                href={`/contests/${contestId}`}
                className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
                ← Back to Contest
            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary mt-6 mb-8">
                Leaderboard
            </h1>

            {entries.length === 0 ? (
                <div className="border border-border rounded-2xl p-12 text-center">
                    <p className="text-text-muted">No rankings yet. Be the first to submit!</p>
                </div>
            ) : (
                <div className="border border-border rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[60px_1fr] px-6 py-3 text-xs uppercase tracking-wider text-text-muted border-b border-border bg-bg-secondary">
                        <span>Rank</span>
                        <span>Participant</span>
                    </div>

                    {entries.map((entry, i) => (
                        <div
                            key={entry.user.id}
                            className={`grid grid-cols-[60px_1fr] px-6 py-4 items-center border-b border-border last:border-b-0 ${i < 3 ? "bg-bg-secondary" : ""
                                }`}
                        >
                            <span className={`font-mono font-bold ${i < 3 ? "text-text-primary" : "text-text-muted"
                                }`}>
                                {entry.rank}
                            </span>
                            <span className="text-text-primary">{entry.user.email}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
