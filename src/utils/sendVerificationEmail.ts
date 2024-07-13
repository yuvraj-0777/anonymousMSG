import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verification code",
            react: VerificationEmail({username, otp:verifyCode}),
        })
        return { success: true, message: "verification email send Successfully"}
    } catch (error) {
        console.error("Error sending verification Email", error)
        return { success: false, message: "Faild to send verification email"}
    }
}