import { z } from "zod";

export const SigninSchema = z.object({
    email: z.email()
});

export interface JwtPayload {
    userId: string;
}
