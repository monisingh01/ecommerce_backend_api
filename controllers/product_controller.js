import Product from "../models/productModel.js"
import asyncHandler from "express-async-handler"
import slugify from "slugify"
import userModel from "../models/user_model.js"


export const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json({
            newProduct
        })
    }
    catch (error) {
        throw new Error(error)
    }
})



export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findByIdAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        )
        res.json({

            success: true,
            message: "Product Updated Successfully",
            updateProduct
        })

    }
    catch (error) {
        throw new Error(error)
    }
})



export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "User deleted Successfully",
            deleteProduct,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})




export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    }
    catch (error) {
        throw new Error(error)
    }
})


export const getAll = asyncHandler(async (req, res) => {
    // console.log(req.query);

    try {
        // Filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])
        console.log(queryObj);

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)


        let query = Product.find(JSON.parse(queryStr))


        //    Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)

        } else {
            query = query.sort("-createdAt")
        }


        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ")
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }


        // Pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if(req.query.page) {
            const productCount = await Product.countDocuments()
            if(skip >= productCount)
            {
                throw new Error ("This Page does not exists")
            }
        }
        console.log(page, limit, skip);




        const product = await query
        res.json(product)
    }
    catch (error) {

        console.log(error);

        throw new Error(error)
    }
})



export const addToWishlist = asyncHandler(async(req,res)=>{
    const {id}= req.user
    const {prodId} = req.body

    console.log(req.body);
    
    const user = await userModel.findById(_id)

    const alreadyAdded =await userModel.find((id)=> id.toString() === prodId)

    if(alreadyAdded){
        const updatedUser = await userModel.findByIdAndUpdate(_id, 
            { $pull : { wishlist: prodId}},
            {new : true}
        )
        return res.json({
            message: "Product is removed from the wishlist",
            updatedUser,
        })
    }
    else{
        const updatedUser = await userModel.findByIdAndUpdate(_id,
            {$push: { wishlist: prodId}},
            {new : true}
        )
        return res.json({
           message:"Product is added to wishlist",
           updateProduct,
        })
    }
})