import { Router } from "express";
import { client } from "db/client";
import { AdminSigninSchema, type JwtPayload } from "../types";
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

export default router;