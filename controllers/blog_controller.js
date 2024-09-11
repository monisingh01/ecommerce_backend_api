import blog from "../models/blog_model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from "../utils/validate_mongodbId.js"
 

export const createBlog = asyncHandler(async(req,res)=>{
try{
const newBlog = await blog.create(req.body)
res.json({
    status: "success",
    newBlog,
})
}
catch(error){
throw new Error (error)
}
})


export const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
         const updateBlog = await blog.findByIdAndUpdate(id, req.body, {
            new : true
         })
         res.json({
            status:true,
            message:"Blog Updated Sucessfully",
            updateBlog,
         })
    }
    catch(error){
throw new Error(error)
    }
})



export const getAllBlog = asyncHandler(async(req,res)=>{
    try{
const getAll = await blog.find()
res.json(getAll)
    }
    catch(error){
        throw new Error(error)
    }
})


export const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
const deletedBlog = await blog.findByIdAndDelete(id)
res.json({
    success:true,
    message:"Blog deleted Successfully",
    deletedBlog,
})
    }
    catch(error){
        throw new Error(error)
    }
})