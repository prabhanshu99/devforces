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

    if (loading) return <p>Loading contests...</p>;

    if (contests.length === 0) return <p>No active contests right now.</p>;

    return (
        <div>
            <h1>Active Contests</h1>
            {contests.map((contest) => (
                <Link key={contest.id} href={`/contests/${contest.id}`}>
                    <div>
                        <h2>{contest.title}</h2>
                        <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
