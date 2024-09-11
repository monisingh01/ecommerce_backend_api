import express from 'express';
import dotenv from "dotenv"
import dbConnect from './config/dbConnection.js';
import authRoute from "./routes/auth_route.js"
import productRoute from "./routes/product_route.js"
import blogRoute from "./routes/blog_route.js"
import categoryRoute from "./routes/product_category_route.js"
import {notFound,errorHandler} from "./middlewares/errorHandler.js"
import cookieParser from 'cookie-parser';
import morgan from "morgan"
import { createCategory } from './controllers/product_category_controller.js';
 

dotenv.config()

const app = express()

dbConnect()


app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use("/api/user",authRoute)
app.use("/api/product",productRoute)
app.use("/api/blog",blogRoute)
app.use("/api/category",categoryRoute)


app.use(notFound)
app.use(errorHandler)


 
app.use("/",(req,res)=>{
    res.send('Hello from Server Side')
})


const PORT = process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})


