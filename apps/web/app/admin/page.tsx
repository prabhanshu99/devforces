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
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <Link
                    href="/admin/challenges"
                    className="bg-bg-card border border-border px-5 py-2.5 rounded-lg text-sm text-accent hover:bg-bg-card-hover hover:border-accent transition-all"
                >
                    Manage Challenges →
                </Link>
            </div>

            {/* Create contest */}
            <div className="bg-bg-card border border-border rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Create New Contest</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        placeholder="Contest Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                    <button
                        onClick={handleCreateContest}
                        className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent-glow cursor-pointer whitespace-nowrap"
                    >
                        + Create
                    </button>
                </div>
            </div>

            {/* Contest list */}
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Manage Contests</h2>
            <div className="flex flex-col gap-3">
                {contests.map((c) => (
                    <div
                        key={c.id}
                        className="flex items-center justify-between bg-bg-card border border-border rounded-xl px-6 py-4 hover:border-accent hover:bg-bg-card-hover transition-all duration-200"
                    >
                        <div>
                            <h3 className="text-lg font-medium text-text-primary">{c.title}</h3>
                            <p className="text-sm text-text-secondary mt-1">
                                Starts: {new Date(c.startTime).toLocaleString()}
                            </p>
                        </div>
                        <Link
                            href={`/admin/contests/${c.id}`}
                            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
                        >
                            Manage →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
