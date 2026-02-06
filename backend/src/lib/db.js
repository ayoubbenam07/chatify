import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined")
        }
        await mongoose.connect(MONGO_URI)
        console.log(`MONGODB CONNECTED`)
    } catch (error) {
        console.error("error connection to mongodb", error)
        process.exit(1)
    }
}