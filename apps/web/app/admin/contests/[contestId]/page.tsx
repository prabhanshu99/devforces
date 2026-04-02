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
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!contest)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-lg">Contest not found.</p>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
            <Link
                href="/admin"
                className="text-text-secondary hover:text-accent transition-colors text-sm"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mt-6 mb-8 text-text-primary">
                Managing: <span className="text-accent">{contest.title}</span>
            </h1>

            {/* Current challenges */}
            <div className="bg-bg-card border border-border rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Challenges in this Contest
                </h2>

                {contest.contestToChallengeMapping.length === 0 ? (
                    <p className="text-text-muted">No challenges linked yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {contest.contestToChallengeMapping.map(({ challenge, index }) => (
                            <div
                                key={challenge.id}
                                className="flex items-center justify-between bg-bg-secondary border border-border rounded-lg px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-accent font-mono font-bold">#{index}</span>
                                    <span className="text-text-primary">{challenge.title}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveChallenge(challenge.id)}
                                    className="text-red hover:bg-red/10 px-3 py-1 rounded-md text-sm transition-colors cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add challenge */}
            <div className="bg-bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Add Existing Challenge
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        placeholder="Challenge ID"
                        value={challengeIdToLink}
                        onChange={(e) => setChallengeIdToLink(e.target.value)}
                        className="flex-1 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <input
                        type="number"
                        placeholder="Index"
                        value={indexToLink}
                        onChange={(e) => setIndexToLink(Number(e.target.value))}
                        className="w-24 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <button
                        onClick={handleAddChallenge}
                        className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent-glow cursor-pointer whitespace-nowrap"
                    >
                        + Add
                    </button>
                </div>
            </div>
        </div>
    );
}
