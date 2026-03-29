"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

    if (loading) return <p>Loading challenge...</p>;
    if (!challenge) return <p>Challenge not found.</p>;

    return (
        <div>
            <h1>{challenge.title}</h1>
            <p>Max Points: {challenge.maxPoints}</p>

            {/* Link to the Notion doc for the problem statement */}
            <a
                href={`https://notion.so/${challenge.notionDocId}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                View Problem Statement →
            </a>

            <h2>Your Submission</h2>
            <textarea
                rows={12}
                placeholder="Write your solution here..."
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </button>

            {submitStatus && <p>{submitStatus}</p>}
        </div>
    );
}
