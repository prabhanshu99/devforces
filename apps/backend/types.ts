import { z } from "zod";

export const SigninSchema = z.object({
    email: z.string().email()
});

export interface JwtPayload {
    userId: string;
}
