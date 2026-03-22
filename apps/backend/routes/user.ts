import { Router } from "express";
import { client } from "db/client";
import { SigninSchema } from "./types";
import jwt from "jsonwebtoken";

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
    }, process.env.EMAIL_JWT_PASSWORD);

    if (process.env.NODE_ENV == "production") {
        await sendEmail(data.email, `Login to Devforces`, `Click here to login : http://localhost:3000/signin?token=${token}`);
    } else {
        console.log("Login link: http://localhost:3000/signin?token=${token}");
    }



});

export default router;