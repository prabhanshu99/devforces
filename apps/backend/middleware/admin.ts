import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types";
import { client } from "db/client";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(411).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD as string) as JwtPayload;
        if (decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            const user = await client.user.findUnique({
                where: {
                    id: decoded.userId
                }
            })
            if (user?.role === "Admin") {
                next();
            } else {
                return res.status(411).json({ message: "Not an admin" });
            }
        }
        else {
            return res.status(411).json({ message: "Invalid token" });
        }
    } catch (error) {
        return res.status(411).json({ message: "Invalid token" });
    }
}