import Product from "../models/productModel.js"
import asyncHandler from "express-async-handler"

export const createProduct = asyncHandler(async (req, res)=>{
 try{
    const newProduct = await Product.create(req.body)
    res.json({
         
        newProduct
    })
 }
 catch(error){
    throw new Error(error)
 }
   
})