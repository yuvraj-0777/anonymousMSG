import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { Message } from "@/model/User.model";


export async function POST(req: Request) {
    await dbConnect()

    const {username, content} = await req.json()

    try {
        const user = await userModel.findOne({username})
        if(!user) {
            return Response.json({
                success: false,
                message: "User Not found"
            }, {status: 404})
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        {
            return Response.json({
                success: true,
                message: "Message Send Successfully"
            }, {status: 200})
        }

    } catch (error) {
        console.log("Error adding messages: ", error)
        {
            return Response.json({
                success: false,
                message: "Internal Server Error"
            }, {status: 500})
        }
    }

}
