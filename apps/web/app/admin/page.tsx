"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Contest {
    id: string;
    title: string;
    startTime: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [contests, setContests] = useState<Contest[]>([]);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/signin");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/active`)
            .then((res) => res.json())
            .then((data) => {
                setContests(data.contests ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function handleCreateContest() {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ?? "",
            },
            body: JSON.stringify({ title, startTime }),
        });

        if (res.ok) {
            const data = await res.json();
            setContests([...contests, data.contest]);
            setTitle("");
            setStartTime("");
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-text-primary">
                    Dashboard
                </h1>
                <Link
                    href="/admin/challenges"
                    className="border border-border hover:border-accent text-text-primary text-sm font-medium px-5 py-2.5 rounded-full transition-all"
                >
                    Challenges →
                </Link>
            </div>

            {/* Create contest */}
            <div className="border border-border rounded-2xl p-6 mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    New Contest
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        placeholder="Contest Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                    />
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                    />
                    <button
                        onClick={handleCreateContest}
                        className="bg-accent hover:bg-accent-hover text-accent-text font-medium px-6 py-3 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Contest list */}
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                Contests
            </h2>
            <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
                {contests.map((c) => (
                    <div
                        key={c.id}
                        className="flex items-center justify-between px-6 py-4"
                    >
                        <div>
                            <h3 className="font-medium text-text-primary">{c.title}</h3>
                            <p className="text-sm text-text-secondary mt-0.5">
                                {new Date(c.startTime).toLocaleString()}
                            </p>
                        </div>
                        <Link
                            href={`/admin/contests/${c.id}`}
                            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                        >
                            Manage →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
