import { Router } from "express";
import { client } from "db/client";
import { SigninSchema } from "./types";

const router = Router();

router.post("/signin", (req, res) => {
    const { success, data } = SigninSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Invalid input" });
    }

});

export default router;