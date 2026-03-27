import { Router } from "express";
import { client } from "db/client";
import { AdminSigninSchema, CreateChallengeSchema, type JwtPayload } from "../types";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mail";
import { adminMiddleware } from "../middleware/admin";
import { CreateContestSchema } from "../types";
import type { RequestWithParams } from "../types";

const router = Router();

// sign a token and send a magic link to the admin

router.post("/signin", async (req, res) => {
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
        await sendEmail(data.email, `Login to Devforces`, `Click here to login : ${process.env.FRONTEND_URL}/user/signin/post?token=${token}`);
    } else {
        console.log(`Login link for ${data.email}: ${process.env.FRONTEND_URL}/user/signin/post?token=${token}`);
    }
});


// create a contest in the database
router.post("/contest", adminMiddleware, async (req, res) => {
    const { success, data } = CreateContestSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Invalid input" });
    }
    const contest = await client.contest.create({
        data: {
            title: data.title,
            startTime: data.startTime,

        }
    })
    res.json({ message: "Contest created successfully", contest });
})

// delete a contest from the database
router.delete("/contest/:contestId", adminMiddleware, async (req, res) => {
    const { contestId } = req.params;
    const contest = await client.contest.delete({
        where: {

            // @ts-ignore
            id: contestId
        }
    })
    res.json({ message: "Contest deleted successfully", contest });
})

// create a challenge in the database
router.post("/challenge", adminMiddleware, async (req, res) => {
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
})

// add a challenge to a contest
router.post("/contest/:contestId/challenge", adminMiddleware, async (req, res) => {
    const { contestId } = req.params;
    const { success, data } = CreateChallengeSchema.safeParse(req.body);
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
})

// delete a challenge from a contest

router.delete("/contest/:contestId/challenge/:challengeId", adminMiddleware, async (req, res) => {
    const { contestId, challengeId } = req.params;
    const contestToChallengeMapping = await client.contestToChallengeMapping.delete({
        where: {
            // @ts-ignore
            contestId: contestId,
            // @ts-ignore
            challengeId: challengeId,
        }
    })
    res.json({ message: "Contest to challenge mapping deleted successfully", contestToChallengeMapping });
})

export default router;