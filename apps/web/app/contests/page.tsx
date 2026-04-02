"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contest {
    id: string;
    title: string;
    startTime: string;
}

export default function ContestsPage() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/active`)
            .then((res) => res.json())
            .then((data) => {
                setContests(data.contests ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
                Active Contests
            </h1>
            <p className="text-text-secondary mb-10">Compete, code, and climb the leaderboard</p>

            {contests.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
                    <p className="text-text-muted text-lg">No active contests right now.</p>
                    <p className="text-text-muted text-sm mt-1">Check back later!</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {contests.map((contest) => (
                        <Link key={contest.id} href={`/contests/${contest.id}`}>
                            <div className="group bg-bg-card border border-border rounded-xl p-6 hover:border-accent hover:bg-bg-card-hover transition-all duration-200 cursor-pointer">
                                <h2 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                                    {contest.title}
                                </h2>
                                <div className="flex items-center gap-2 mt-3 text-sm text-text-secondary">
                                    <span className="inline-block w-2 h-2 bg-green rounded-full animate-pulse"></span>
                                    Started: {new Date(contest.startTime).toLocaleString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
