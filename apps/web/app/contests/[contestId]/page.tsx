"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Challenge {
    id: string;
    title: string;
    maxPoints: number;
}

interface ContestToChallenge {
    index: number;
    challenge: Challenge;
}

interface Contest {
    id: string;
    title: string;
    startTime: string;
    contestToChallengeMapping: ContestToChallenge[];
}

export default function ContestPage() {
    const { contestId } = useParams<{ contestId: string }>();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/${contestId}`)
            .then((res) => res.json())
            .then((data) => {
                setContest(data.contest);
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

    if (!contest)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted">Contest not found.</p>
            </div>
        );

    const challenges = [...contest.contestToChallengeMapping].sort(
        (a, b) => a.index - b.index
    );

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <Link href="/contests" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                ← All Contests
            </Link>

            <div className="flex items-start justify-between mt-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-text-primary">{contest.title}</h1>
                    <p className="text-text-secondary mt-2">
                        {new Date(contest.startTime).toLocaleString()}
                    </p>
                </div>
                <Link
                    href={`/contests/${contest.id}/leaderboard`}
                    className="border border-border hover:border-accent text-text-primary text-sm font-medium px-5 py-2.5 rounded-full transition-all"
                >
                    Leaderboard
                </Link>
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                Challenges
            </h2>

            {challenges.length === 0 ? (
                <div className="border border-border rounded-2xl p-8 text-center">
                    <p className="text-text-muted">No challenges added yet.</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
                    {challenges.map(({ challenge, index }) => (
                        <Link
                            key={challenge.id}
                            href={`/contests/${contest.id}/${challenge.id}`}
                        >
                            <div className="flex items-center justify-between px-6 py-4 hover:bg-bg-secondary transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <span className="text-text-muted font-mono text-sm w-6">
                                        {index}
                                    </span>
                                    <span className="font-medium text-text-primary">
                                        {challenge.title}
                                    </span>
                                </div>
                                <span className="text-sm text-text-secondary">
                                    {challenge.maxPoints} pts
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
