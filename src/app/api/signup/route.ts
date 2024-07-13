import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import UserModel from "@/model/User.model";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await req.json()
        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username Already taken"
            },{status: 400})
        }

        const existingUserByEmail = await userModel.findOne({
            email,
            isVerified: true
        })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User email already in use"
                    }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
            success: false,
            message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered SUCCESSFULLY"
        }, {status: 201})

    } catch (error) {
        console.error("Error registring User", error)
        return Response.json({
            success: false,
            message: "Error Registering user"
        },
    {
        status: 500
    })
    }
}