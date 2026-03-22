import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD) as JwtPayload;
    if (decoded.userId) {
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }
    else {
        return res.status(411).json({ message: "Invalid token" });
    }
}