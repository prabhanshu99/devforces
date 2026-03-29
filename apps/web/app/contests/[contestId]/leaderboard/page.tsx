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

    if (loading) return <p>Loading leaderboard...</p>;

    return (
        <div>
            <Link href={`/contests/${contestId}`}>← Back to Contest</Link>

            <h1>Leaderboard</h1>

            {entries.length === 0 ? (
                <p>No rankings yet. Be the first to submit!</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.user.id}>
                                <td>#{entry.rank}</td>
                                <td>{entry.user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
