import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(req: Request, {params}: {params: {messageId: string}}) {
    const messageId = params.messageId
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authorised"
        }, {status: 401})
    }

    try {
        const updateRes = await userModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
    
        if (updateRes.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already Deleted"
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            message: "Message Deleted"
        }, {status: 200})

    } catch (error) {
        console.log("Error in delete message route", error)
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, {status: 500})
    }

}