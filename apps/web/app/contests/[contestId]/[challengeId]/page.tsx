"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Challenge {
    id: string;
    title: string;
    notionDocId: string;
    maxPoints: number;
}

export default function ChallengePage() {
    const { contestId, challengeId } = useParams<{ contestId: string; challengeId: string }>();
    const router = useRouter();

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/user/signin");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/${contestId}/${challengeId}`, {
            headers: { Authorization: token },
        })
            .then((res) => {
                if (res.status === 411) {
                    router.push("/user/signin");
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setChallenge(data.challenge);
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, [contestId, challengeId]);

    async function handleSubmit() {
        if (!submission.trim()) {
            setSubmitStatus("Please write something before submitting.");
            return;
        }

        const token = localStorage.getItem("token");
        setSubmitting(true);
        setSubmitStatus("");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contest/submit/${contestId}/${challengeId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ?? "",
                },
                body: JSON.stringify({ submission }),
            }
        );

        const data = await res.json();
        setSubmitting(false);

        if (res.ok) {
            setSubmitStatus("Submitted successfully!");
            setSubmission("");
        } else {
            setSubmitStatus(data.message ?? "Submission failed.");
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!challenge)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-lg">Challenge not found.</p>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
            <Link
                href={`/contests/${contestId}`}
                className="text-text-secondary hover:text-accent transition-colors text-sm"
            >
                ← Back to Contest
            </Link>

            <div className="mt-6 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-text-primary">{challenge.title}</h1>
                    <span className="bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full">
                        {challenge.maxPoints} pts
                    </span>
                </div>

                <a
                    href={`https://notion.so/${challenge.notionDocId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan hover:underline text-sm"
                >
                    View Problem Statement →
                </a>
            </div>

            <div className="bg-bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Your Submission</h2>

                <textarea
                    rows={12}
                    placeholder="Write your solution here..."
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y"
                />

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent-glow cursor-pointer"
                    >
                        {submitting ? "Submitting..." : "Submit Solution"}
                    </button>

                    {submitStatus && (
                        <p className={`text-sm ${submitStatus.includes("success") ? "text-green" : "text-red"}`}>
                            {submitStatus}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
