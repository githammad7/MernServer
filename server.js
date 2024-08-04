import express from "express"
import colors from "colors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import morgan from "morgan"
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cors from 'cors'


dotenv.config()
connectDB();


const app=express();
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)


app.get("/",(req,res)=>{
    res.send("<h1>Welcome to the Ecommerse Store</h1>")
})
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`lisitng to the port no ${PORT}`.bgCyan.white)
}); 
