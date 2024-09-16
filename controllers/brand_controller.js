import brand from "../models/brand_model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from "../utils/validate_mongodbId.js"



export const createBrand = asyncHandler(async(req,res)=>{
    try{
        const newBrand = await brand.create(req.body)
        res.json(newBrand)
    }
    catch(error){
        throw new Error(error)
    }
})


export const updateBrand = asyncHandler(async(req,res)=>{
    const{id} = req.params
    validateMongodbId(id)
    try{
        const update = await brand.findByIdAndUpdate(
            id,req.body,
            {new:true}
        )
        res.json(update)
    } 
    catch(error){
        throw new Error(error)
    }
})


export const deleteBrand = asyncHandler(async(req,res)=>{
    const {id}= req.params
    validateMongodbId(id)
    try{
        const deletedBrand = await brand.findByIdAndDelete(id)
        res.json({
            message:"Brand Deleted Successfully",
            deletedBrand
        })
    }
    catch(error){
        console.log(error.message);
        
        throw new Error(error)
    }
})

export const getBrandById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const getBrand = await brand.findByIdAndUpdate(id)
        res.json(getBrand)
    }
    catch(error){
        throw new Error(error)
    }
 })


 export const getAllBrand = asyncHandler(async(req,res)=>{
    try{
        const getAll = await brand.find()
        res.json({
            success:true,
            message:"All Brand are listed here",
            getAll})
    }
    catch(Error){
        throw new Error(error)
    }
 })