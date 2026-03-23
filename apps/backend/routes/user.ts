import { Router } from "express";
import { client } from "db/client";
import { SigninSchema, type JwtPayload } from "../types";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mail";

const router = Router();

router.post("/signin", async (req, res) => {
    const { success, data } = SigninSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Invalid input" });
    }

    const user = await client.user.upsert({
        create: {
            email: data.email,
            role: "User"
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
        await sendEmail(data.email, `Login to Devforces`, `Click here to login : ${process.env.FRONTEND_URL}/user/login/post?token=${token}`);
    } else {
        console.log(`Login link for ${data.email}: ${process.env.FRONTEND_URL}/user/login/post?token=${token}`);
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

export default router;