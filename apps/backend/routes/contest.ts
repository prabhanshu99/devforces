import { Router } from "express";

const router = Router();

router.get("/active", (req, res) => {
    res.json({ message: "ongoing contests" });
});

router.get("/finished", (req, res) => {
    res.json({ message: "finished contests" });
});

router.get("/:contestId", (req, res) => {
    res.json({ message: "contestId" });
});

router.get("/:constestId/:challengeId", (req, res) => {
    res.json({ message: "challengeId" });
});

router.get("/leaderboard/:contestId", (req, res) => {
    res.json({ message: "leaderboard" });
});

router.post("/submit/:constestId/:challengeId", (req, res) => {
    res.json({ message: "submission done" });
});


export default router;