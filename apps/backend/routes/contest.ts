import { Router } from "express";
import { client } from "db/client";
import { userMiddleware } from "../middleware/user";
import { SubmitSchema } from "../types";

const router = Router();

// get all active contests
router.get("/active", async (req, res) => {
    try {
        const now = new Date();
        const contests = await client.contest.findMany({
            where: {
                startTime: {
                    lte: now
                },
                endTime: {
                    gt: now
                }
            }
        })

        return res.json({ contests });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

// get all finished contests
router.get("/finished", async (req, res) => {
    try {
        const contests = await client.contest.findMany({
            where: {
                endTime: {
                    lte: new Date()
                }
            }
        })
        return res.json({ contests });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

// get leaderboard of a contest
router.get("/leaderboard/:contestId", async (req, res) => {
    try {
        const { contestId } = req.params;

        const leaderboard = await client.leaderboard.findMany({
            where: {
                contestId: contestId
            }, orderBy: {
                rank: "asc"
            }, include: {
                user: true
            }
        })
        res.json({ leaderboard });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

// get a contest
router.get("/:contestId", async (req, res) => {
    try {
        const { contestId } = req.params;

        const contest = await client.contest.findUnique({
            where: {
                id: contestId
            }, include: {
                contestToChallengeMapping: {
                    include: {
                        challenge: true
                    }
                }
            }
        })
        res.json({ contest });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

// get a challenge in a contest
router.get("/:contestId/:challengeId", userMiddleware, async (req, res) => {
    try {
        const { contestId, challengeId } = req.params;
        const challenge = await client.challenge.findUnique({
            where: {
                // @ts-ignore
                id: challengeId
            }, include: {
                contestToChallengeMapping: {
                    where: {
                        // @ts-ignore
                        contestId: contestId
                    }, include: {
                        challenge: true
                    }
                }
            }
        })
        res.json({ challenge });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

// submit a challenge
router.post("/submit/:contestId/:challengeId", userMiddleware, async (req, res) => {
    try {
        const { success, data } = SubmitSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Invalid input" });
        }
        const { contestId, challengeId } = req.params;

        const contestToChallengeMapping = await client.contestToChallengeMapping.findUnique({
            where: {
                contestId_challengeId: {
                    contestId: contestId as string,
                    challengeId: challengeId as string,
                }
            }
        })

        if (!contestToChallengeMapping) {
            return res.status(411).json({ message: "Invalid contest or challenge" });
        }
        // @ts-ignore
        const userId = req.userId;

        const submission = await client.contestSubmission.create({
            data: {
                submission: data.submission,
                contestToChallengeMappingId: contestToChallengeMapping.id,
                userId: userId,
                points: 0
            }
        })

        return res.json({ submission });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});


export default router;