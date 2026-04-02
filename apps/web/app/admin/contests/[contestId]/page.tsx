"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Challenge {
    id: string;
    title: string;
}

interface ContestToChallenge {
    index: number;
    challenge: Challenge;
}

interface Contest {
    id: string;
    title: string;
    contestToChallengeMapping: ContestToChallenge[];
}

export default function ContestAdmin() {
    const { contestId } = useParams<{ contestId: string }>();
    const router = useRouter();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [challengeIdToLink, setChallengeIdToLink] = useState("");
    const [indexToLink, setIndexToLink] = useState(0);

    function fetchContest() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/${contestId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.contest) {
                    setContest(data.contest);
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/signin");
            return;
        }
        fetchContest();
    }, [contestId]);

    async function handleAddChallenge() {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/contest/${contestId}/challenge`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ?? "",
                },
                body: JSON.stringify({
                    challengeId: challengeIdToLink,
                    index: Number(indexToLink),
                }),
            }
        );

        if (res.ok) {
            setChallengeIdToLink("");
            setIndexToLink(0);
            fetchContest();
        }
    }

    async function handleRemoveChallenge(challengeId: string) {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/contest/${contestId}/challenge/${challengeId}`,
            {
                method: "DELETE",
                headers: { Authorization: token ?? "" },
            }
        );

        if (res.ok) {
            fetchContest();
        }
    }

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

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <Link href="/admin" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                ← Dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-6 mb-10">
                {contest.title}
            </h1>

            {/* Current challenges */}
            <div className="border border-border rounded-2xl p-6 mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Linked Challenges
                </h2>

                {contest.contestToChallengeMapping.length === 0 ? (
                    <p className="text-text-muted text-sm">No challenges linked yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {contest.contestToChallengeMapping.map(({ challenge, index }) => (
                            <div
                                key={challenge.id}
                                className="flex items-center justify-between bg-bg-secondary rounded-xl px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-text-muted font-mono text-sm w-6">{index}</span>
                                    <span className="text-text-primary font-medium">{challenge.title}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveChallenge(challenge.id)}
                                    className="text-red text-sm hover:underline cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add challenge */}
            <div className="border border-border rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Add Challenge
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        placeholder="Challenge ID"
                        value={challengeIdToLink}
                        onChange={(e) => setChallengeIdToLink(e.target.value)}
                        className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                    />
                    <input
                        type="number"
                        placeholder="Index"
                        value={indexToLink}
                        onChange={(e) => setIndexToLink(Number(e.target.value))}
                        className="w-24 bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                    />
                    <button
                        onClick={handleAddChallenge}
                        className="bg-accent hover:bg-accent-hover text-accent-text font-medium px-6 py-3 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
