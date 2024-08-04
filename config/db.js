import mongoose from 'mongoose'
import colors from "colors"
const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO)
        console.log(`connection successfully${conn.connection.host}`.bgMagenta)
    } catch (error) {
        console.log(`failed to connect ${error}`.bgWhite.red)
    }
}
export default connectDB