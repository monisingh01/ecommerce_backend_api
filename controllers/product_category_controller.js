import category from "../models/product_category_model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from "../utils/validate_mongodbId.js"


export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await category.create(req.body)
        res.json({
            success: true,
            message: "Category creted successfully",
            newCategory,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})


export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.body
    validateMongodbId(id)
    try {
        const updatedCategory = await category.findByIdAndUpdate(id, req.body,
            { new: true })
        res.json({
            success: true,
            message: "Category updated Successfully",
            updatedCategory,
        })
    }
    catch (error) {
        console.log(error.message);

        throw new Error(error)
    }
})


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const deletedCategory = await category.findByIdAndDelete(id)
        return res.json({
            success: true,
            message: "Category deleted Successfully",
            deletedCategory,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})



export const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAll = await category.find()
        return res.json(getAll)
    }

    catch (error) {
        throw new Error(error)
    }
})


export const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const getCategory = await category.findById(id)
        return res.json(getCategory)
    }
    catch (error) {
        throw new Error(error)
    }

})

