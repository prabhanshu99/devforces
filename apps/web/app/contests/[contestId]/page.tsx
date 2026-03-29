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

    if (loading) return <p>Loading contest...</p>;
    if (!contest) return <p>Contest not found.</p>;

    // Sort challenges by their index in the contest
    const challenges = [...contest.contestToChallengeMapping].sort(
        (a, b) => a.index - b.index
    );

    return (
        <div>
            <h1>{contest.title}</h1>
            <p>Started: {new Date(contest.startTime).toLocaleString()}</p>

            <Link href={`/contests/${contest.id}/leaderboard`}>
                View Leaderboard →
            </Link>

            <h2>Challenges</h2>
            {challenges.length === 0 ? (
                <p>No challenges added yet.</p>
            ) : (
                challenges.map(({ challenge, index }) => (
                    <Link
                        key={challenge.id}
                        href={`/contests/${contest.id}/${challenge.id}`}
                    >
                        <div>
                            <span>#{index}</span>
                            <h3>{challenge.title}</h3>
                            <span>{challenge.maxPoints} pts</span>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}
