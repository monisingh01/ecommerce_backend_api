import coupon from "../models/coupon.model.js"
import asyncHandler from "express-async-handler"


export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const { name, expire, discount } = req.body

        const newCoupon = await coupon.create(req.body)
        res.json({
            success: true,
            message: "Coupon Created Successfully",
            newCoupon,
        })
    }
    catch (error) {
        console.log(error.message);

        throw new Error(error)
    }
})


export const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getAll = await coupon.find()
        return res.json({
            success: true,
            message: "All Coupon are listed here",
            getAll
        })
    }
    catch (error) {
        throw new Error(error)
    }
})



export const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updatedCoupon = await coupon.findByIdAndUpdate(
            id, req.body, { new: true })
        return res.json({ succes: true, message: "Coupon updated Successfully", updatedCoupon })

    }
    catch (error) {
  throw new Error(error)
    }
})



export const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
const deletedCoupon = await coupon.findByIdAndDelete(id)
return res.json({
    success:true,
    message:"Coupon Deleted Successfully",
    deletedCoupon,
})
    }
    catch(error){
        throw new Error(error)
    }
})