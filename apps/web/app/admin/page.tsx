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

        // We can reuse the public active route or create an admin list route
        // For now, let's fetch all (active/finished logic can be refined)
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

    if (loading) return <p>Loading admin panel...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <section>
                <h2>Create New Contest</h2>
                <input
                    placeholder="Contest Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                />
                <button onClick={handleCreateContest}>Create Contest</button>
            </section>

            <hr />

            <section>
                <h2>Manage Contests</h2>
                {contests.map(c => (
                    <div key={c.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                        <h3>{c.title}</h3>
                        <p>Starts: {new Date(c.startTime).toLocaleString()}</p>
                        <Link href={`/admin/contests/${c.id}`}>Manage Challenges →</Link>
                    </div>
                ))}
            </section>

            <Link href="/admin/challenges">Manage Standalone Challenges →</Link>
        </div>
    );
}
