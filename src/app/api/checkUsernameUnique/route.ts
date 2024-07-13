import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import {z} from "zod"
import { userNameValidation } from "@/schemas/signup.schema";

const usernameQuerrySchema = z.object({
    username: userNameValidation
})

export async function GET(req: Request) {

    await dbConnect()

    try {
        const {searchParams} = new URL(req.url)
        const querryParam = {
            username: searchParams.get("username")
        }

        // Validate with zod
        const result = usernameQuerrySchema.safeParse(querryParam)
        // console.log("TEMPORARY => ",request) // Remove 

        if(!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid querry parameter"
            }, {status: 400})
        }

        const {username} = result.data

        const existingVerifiedUser = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, {status: 200})
        
    } catch (error) {
        console.log("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}