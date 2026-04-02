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
                <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!challenge)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted">Challenge not found.</p>
            </div>
        );

    return (
        <div className="min-h-screen px-4 py-16 max-w-3xl mx-auto">
            <Link
                href={`/contests/${contestId}`}
                className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
                ← Back to Contest
            </Link>

            <div className="mt-6 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">{challenge.title}</h1>
                    <span className="text-sm text-text-secondary border border-border px-3 py-0.5 rounded-full">
                        {challenge.maxPoints} pts
                    </span>
                </div>

                <a
                    href={`https://notion.so/${challenge.notionDocId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary underline underline-offset-4 text-sm transition-colors"
                >
                    View Problem Statement →
                </a>
            </div>

            <div className="border border-border rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Your Submission
                </h2>

                <textarea
                    rows={12}
                    placeholder="Write your solution here..."
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all resize-y"
                />

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-accent-text font-medium px-8 py-3 rounded-full transition-all duration-200 cursor-pointer"
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
