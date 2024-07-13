import { z } from "zod"

export const userNameValidation = z
        .string()
        .min(2, "Username must be minimum 2 characters")
        .max(20, "Username must be no more than 2o characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: "Invalid Email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})