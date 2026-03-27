import { Router } from "express";
import { client } from "db/client";
import { userMiddleware } from "../middleware/user";
import { SubmitSchema } from "../types";

const router = Router();

// get all active contests
router.get("/active", (req, res) => {
    const contests = client.contest.findMany({
        where: {
            startTime: {
                // lte : less than or equal to
                // gte : greater than or equal to
                lte: new Date()
            }
        }
    })

    return res.json({ contests });
});

// get all finished contests
router.get("/finished", (req, res) => {
    const contests = client.contest.findMany({
        where: {
            startTime: {
                lte: new Date()
            }
        }
    })
    return res.json({ contests });
});

// get leaderboard of a contest
router.get("/leaderboard/:contestId", (req, res) => {
    const { contestId } = req.params;

    const leaderboard = client.leaderboard.findMany({
        where: {
            contestId: contestId
        }, orderBy: {
            rank: "asc"
        }, include: {
            user: true
        }
    })
    res.json({ leaderboard });
});

// get a contest
router.get("/:contestId", (req, res) => {
    const { contestId } = req.params;

    const contest = client.contest.findUnique({
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
});

// get a challenge in a contest
router.get("/:contestId/:challengeId", userMiddleware, (req, res) => {
    const { contestId, challengeId } = req.params;
    const challenge = client.challenge.findUnique({
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
});

// submit a challenge
router.post("/submit/:contestId/:challengeId", userMiddleware, async (req, res) => {
    const { success, data } = SubmitSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Invalid input" });
    }
    const { contestId, challengeId } = req.params;

    const contestToChallengeMapping = await client.contestToChallengeMapping.findUnique({
        where: {
            // @ts-ignore
            contestId: contestId,
            // @ts-ignore
            challengeId: challengeId,
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
});


export default router;