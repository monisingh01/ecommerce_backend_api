            import express from 'express';
            import dotenv from "dotenv"
            import dbConnect from './config/dbConnection.js';
            import authRoute from "./routes/auth_route.js"
            import productRoute from "./routes/product_route.js"
            import blogRoute from "./routes/blog_route.js"
            import categoryRoute from "./routes/product_category_route.js"
            import brandRoute from "./routes/brand_route.js"
            import couponRoute from "./routes/coupon_Routes.js"
            import { notFound, errorHandler } from "./middlewares/errorHandler.js"
            import cookieParser from 'cookie-parser';
            import morgan from "morgan"
            import swaggerUi from "swagger-ui-express"
            import path from 'path'
  

            dotenv.config()

            const app = express()

            dbConnect()
            const PORT = process.env.PORT || 3000



            app.use(morgan('dev'))
            app.use(express.json())
            app.use(cookieParser())
            app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
                swaggerOptions: {
                  url: '/swagger_output.json'
                }
              }));
              app.use('/swagger_output.json', express.static(path.resolve('./swagger_output.json')));
            


            app.use("/api/user", authRoute)
            app.use("/api/product", productRoute)
            app.use("/api/blog", blogRoute)
            app.use("/api/category", categoryRoute)
            app.use("/api/brand", brandRoute)
            app.use("/api/coupon", couponRoute)



            app.use(notFound)
            app.use(errorHandler)




            app.listen(PORT, () => {
                console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
                
                console.log(`Server is listening on ${PORT}`)
            })


