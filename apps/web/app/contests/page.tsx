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
                <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-1">
                Contests
            </h1>
            <p className="text-text-secondary mb-10">Compete, code, and climb the leaderboard</p>

            {contests.length === 0 ? (
                <div className="border border-border rounded-2xl p-12 text-center">
                    <p className="text-text-muted">No active contests right now.</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
                    {contests.map((contest) => (
                        <Link key={contest.id} href={`/contests/${contest.id}`}>
                            <div className="px-6 py-5 hover:bg-bg-secondary transition-colors cursor-pointer">
                                <h2 className="text-lg font-semibold text-text-primary">
                                    {contest.title}
                                </h2>
                                <p className="text-sm text-text-secondary mt-1">
                                    {new Date(contest.startTime).toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
