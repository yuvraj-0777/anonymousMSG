import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authorised"
        }, {status: 401})
    }

    const userId = user._id
    const {acceptMessages} = await req.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true}
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to update accepting messages"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: "updated accepting messages status SUCCESSFULLY",
            updatedUser
        }, {status: 200})

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update user status to update messages"
        }, {status: 500})
    }
}

export async function Get(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authorised"
        }, {status: 401})
    }

    const userId = user._id

    try {
        const foundUser = await userModel.findById(userId)
    
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to found user"
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting messages accepting status"
        }, {status: 500})
    }
}