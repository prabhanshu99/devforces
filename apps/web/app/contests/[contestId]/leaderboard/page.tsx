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
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    const medalColors = ["text-yellow", "text-text-secondary", "text-yellow"];

    return (
        <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
            <Link
                href={`/contests/${contestId}`}
                className="text-text-secondary hover:text-accent transition-colors text-sm"
            >
                ← Back to Contest
            </Link>

            <h1 className="text-4xl font-bold mt-6 mb-8 bg-gradient-to-r from-yellow to-accent bg-clip-text text-transparent">
                🏆 Leaderboard
            </h1>

            {entries.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
                    <p className="text-text-muted text-lg">No rankings yet.</p>
                    <p className="text-text-muted text-sm mt-1">Be the first to submit!</p>
                </div>
            ) : (
                <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[80px_1fr] px-6 py-3 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                        <span>Rank</span>
                        <span>Participant</span>
                    </div>

                    {entries.map((entry, i) => (
                        <div
                            key={entry.user.id}
                            className={`grid grid-cols-[80px_1fr] px-6 py-4 items-center border-b border-border last:border-b-0 ${i < 3 ? "bg-accent/5" : ""
                                }`}
                        >
                            <span className={`font-mono font-bold text-lg ${i < 3 ? medalColors[i] : "text-text-secondary"
                                }`}>
                                #{entry.rank}
                            </span>
                            <span className="text-text-primary">{entry.user.email}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
