import { z } from "zod";

export const loginSchema = z.object({
    email:z.string().email("Please enter a valid email"),
    password:z.string().min(8, "password must be at least 8 characters"),
    remember:z.boolean().optional(),
});

export const signupSchema = z.object({
    email:z.string().email("Please enter a valid email"),
    username:z.string().min(3, "Username must be at least 3 characters"),
    password:z.string().min(8, "minimum password length is 8 characters")
    .regex(/[A-Z]/, "password must contain at least one uppercase letter")
    .regex(/[a-z]/, "password must contain at least one lowercase letter")
    .regex(/[0-9]/,"password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/,"password must contain at least one special character"),
});

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>