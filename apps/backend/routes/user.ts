import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
    res.json({ message: "User created successfully" });
});

router.post("/signin", (req, res) => {
    res.json({ message: "User signed in successfully" });
});

export default router;