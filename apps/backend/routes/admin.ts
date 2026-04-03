import { Router } from "express";
import { client } from "db/client";
import { AdminSigninSchema, CreateChallengeSchema, type JwtPayload } from "../types";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mail";
import { adminMiddleware } from "../middleware/admin";
import { CreateContestSchema } from "../types";
import type { RequestWithParams } from "../types";
import { AddChallengeToContestSchema } from "../types";

const router = Router();

// sign a token and send a magic link to the admin

router.post("/signin", async (req, res) => {
    try {
        const { success, data } = AdminSigninSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Invalid input" });
        }

        const user = await client.user.upsert({
            create: {
                email: data.email,
                role: "Admin"
            },
            update: {},
            where: {
                email: data.email
            }

        })

        const token = jwt.sign({
            userId: user.id
        }, process.env.EMAIL_JWT_PASSWORD as string);

        if (process.env.NODE_ENV == "production") {
            await sendEmail(data.email, `Login to Devforces`, `Click here to login : ${process.env.FRONTEND_URL}/admin/signin/post?token=${token}`);
        } else {
            console.log(`Login link for ${data.email}: ${process.env.FRONTEND_URL}/admin/signin/post?token=${token}`);
        }

        return res.json({ message: "Check your email for the login link" });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
});

router.get("/signin/post", async (req, res) => {
    try {
        const token = req.query.token as string;
        const decoded = jwt.verify(token, process.env.EMAIL_JWT_PASSWORD as string) as JwtPayload;
        if (decoded.userId) {
            const token = jwt.sign({
                userId: decoded.userId
            }, process.env.JWT_PASSWORD as string);
            res.json({ token });
        } else {
            return res.status(411).json({ message: "Invalid token" });
        }

    } catch (error) {
        return res.status(411).json({ message: "Invalid token" })
    }
})


// create a contest in the database
router.post("/contest", adminMiddleware, async (req, res) => {
    try {
        const { success, data } = CreateContestSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Invalid input" });
        }
        const contest = await client.contest.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,

            }
        })
        res.json({ message: "Contest created successfully", contest });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

// delete a contest from the database
router.delete("/contest/:contestId", adminMiddleware, async (req, res) => {
    try {
        const { contestId } = req.params;
        const contest = await client.contest.delete({
            where: {

                // @ts-ignore
                id: contestId
            }
        })
        res.json({ message: "Contest deleted successfully", contest });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

// get all challenges
router.get("/challenge", adminMiddleware, async (req, res) => {
    try {
        const challenges = await client.challenge.findMany();
        res.json({ challenges });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

// create a challenge in the database
router.post("/challenge", adminMiddleware, async (req, res) => {
    try {
        const { success, data } = CreateChallengeSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Invalid input" });
        }
        const challenge = await client.challenge.create({
            data: {
                title: data.title,
                notionDocId: data.notionDocId,
                maxPoints: data.maxPoints,
            }
        })
        res.json({ message: "Challenge created successfully", challenge });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

// add a challenge to a contest
router.post("/contest/:contestId/challenge", adminMiddleware, async (req, res) => {
    try {
        const { contestId } = req.params;
        const { success, data } = AddChallengeToContestSchema.safeParse(req.body);

        if (!success) {
            return res.status(411).json({ message: "Invalid input" });
        }
        const contestToChallengeMapping = await client.contestToChallengeMapping.create({
            data: {
                // @ts-ignore
                contestId: contestId,
                challengeId: data.challengeId,
                index: data.index,
            }
        })
        res.json({ message: "Contest to challenge mapping created successfully", contestToChallengeMapping });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

// delete a challenge from a contest

router.delete("/contest/:contestId/challenge/:challengeId", adminMiddleware, async (req, res) => {
    try {
        const { contestId, challengeId } = req.params;
        const contestToChallengeMapping = await client.contestToChallengeMapping.delete({
            where: {
                contestId_challengeId: {
                    contestId: contestId as string,
                    challengeId: challengeId as string,
                }
            }
        })
        res.json({ message: "Contest to challenge mapping deleted successfully", contestToChallengeMapping });
    } catch (e) {
        return res.status(411).json({ message: "Invalid input" });
    }
})

export default router;