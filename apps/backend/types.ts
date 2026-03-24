import { z } from "zod";

export const SigninSchema = z.object({
    email: z.string().email()
});

export const AdminSigninSchema = z.object({
    email: z.string().email()
});

export const CreateContestSchema = z.object({
    title: z.string(),
    startTime: z.coerce.date()
})

export const CreateChallengeSchema = z.object({
    title: z.string(),
    notionDocId: z.string(),
    maxPoints: z.number(),

})

export const AddChallengeToContestSchema = z.object({
    index: z.number(),
    challengeId: z.string(),
})

export const SubmitSchema = z.object({
    submission: z.string(),

})

export interface JwtPayload {
    userId: string;
}
