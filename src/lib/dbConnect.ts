import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {dbName: process.env.DB_NAME})
        // console.log(db)

        connection.isConnected = db.connections[0].readyState

        console.log("DB CONNECTED")
    } catch (error) {
        console.log("DB CONNECTION FAILED", error)
        process.exit(1)
    }
}

export default dbConnect