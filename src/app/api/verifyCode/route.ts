import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { use } from "react";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const {username, code} = await req.json()

        // const decodedUsername = decodeURIComponent(username)

        const user = await userModel.findOne({username})

        if (!user) {
            return Response.json({
                success: false,
                message: "Error Verifying user"
            }, {status: 500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account Verefied SUCCESSFULLY"
            }, {status: 200})
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code Expired. SignUp again"
            }, {status: 400})
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification code"
            }, {status: 400})
        }

    } catch (error) {
        console.log("Error Verifying user", error)
        return Response.json({
            success: false,
            message: "Error Verifying user"
        }, {status: 500})
    }
}