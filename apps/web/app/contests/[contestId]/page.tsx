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
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!contest)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-lg">Contest not found.</p>
            </div>
        );

    const challenges = [...contest.contestToChallengeMapping].sort(
        (a, b) => a.index - b.index
    );

    return (
        <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-text-primary">{contest.title}</h1>
                    <p className="text-text-secondary mt-2">
                        Started: {new Date(contest.startTime).toLocaleString()}
                    </p>
                </div>
                <Link
                    href={`/contests/${contest.id}/leaderboard`}
                    className="bg-bg-card border border-border px-5 py-2.5 rounded-lg text-sm text-accent hover:bg-bg-card-hover hover:border-accent transition-all"
                >
                    🏆 Leaderboard
                </Link>
            </div>

            <h2 className="text-2xl font-semibold text-text-primary mb-4">Challenges</h2>

            {challenges.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                    <p className="text-text-muted">No challenges added yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {challenges.map(({ challenge, index }) => (
                        <Link
                            key={challenge.id}
                            href={`/contests/${contest.id}/${challenge.id}`}
                        >
                            <div className="group flex items-center justify-between bg-bg-card border border-border rounded-xl px-6 py-4 hover:border-accent hover:bg-bg-card-hover transition-all duration-200 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <span className="text-accent font-mono font-bold text-lg">
                                        #{index}
                                    </span>
                                    <h3 className="text-lg font-medium text-text-primary group-hover:text-accent transition-colors">
                                        {challenge.title}
                                    </h3>
                                </div>
                                <span className="bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full">
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
