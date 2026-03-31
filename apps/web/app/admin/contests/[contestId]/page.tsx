"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/signin");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/${contestId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.contest) {
                    setContest(data.contest);
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, [contestId]);

    async function handleAddChallenge() {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contest/${contestId}/challenge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ?? "",
            },
            body: JSON.stringify({
                challengeId: challengeIdToLink,
                index: Number(indexToLink),
            }),
        });

        if (res.ok) {
            router.refresh();
            setChallengeIdToLink("");
            setIndexToLink(0);
        }
    }

    async function handleRemoveChallenge(challengeId: string) {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contest/${contestId}/challenge/${challengeId}`, {
            method: "DELETE",
            headers: { Authorization: token ?? "" },
        });

        if (res.ok) {
            router.refresh();
        }
    }

    if (loading) return <p>Loading contest data...</p>;
    if (!contest) return <p>Contest not found.</p>;

    return (
        <div>
            <h1>Managing: {contest.title}</h1>

            <section>
                <h2>Challenges in this Contest</h2>
                {contest.contestToChallengeMapping.map(({ challenge, index }) => (
                    <div key={challenge.id}>
                        <span>#{index} | {challenge.title}</span>
                        <button onClick={() => handleRemoveChallenge(challenge.id)}>Remove</button>
                    </div>
                ))}
            </section>

            <hr />

            <section>
                <h2>Add Existing Challenge</h2>
                <input
                    placeholder="Existing Challenge ID"
                    value={challengeIdToLink}
                    onChange={e => setChallengeIdToLink(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Index (e.g. 1, 2...)"
                    value={indexToLink}
                    onChange={e => setIndexToLink(Number(e.target.value))}
                />
                <button onClick={handleAddChallenge}>Add to Contest</button>
            </section>
        </div>
    );
}
