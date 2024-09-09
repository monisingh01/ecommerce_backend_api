import userModel from "../models/user_model.js"
import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import { validateMongoDbId } from "../utils/validate_mongodbId.js"
import { generateToken } from "../config/jwtToken.js"
import { generateRefreshToken } from "../config/refreshToken.js"
import jwt from "jsonwebtoken"


// User Register
export const register = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body
        // console.log("",req.body);

        const hashedPassword = await bcrypt.hash(password, 10)


        const findUser = await userModel.findOne({ email })
        if (!findUser) {
            // Create a new User
            const newUser = await userModel.create({
                ...req.body,
                password: hashedPassword,
            })
            return res.status(200).json({
                success: true,
                message: "User Register Successfully",
                record: newUser
            })

        } else {
            throw new Error("User already Exist")
        }
    }
    catch (error) {
        // console.log(error);

        return res.json({
            message: "Error creating user",
            success: false,
            error: error.message,
        })
    }

})

// Login User
export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        // Check if user is exist or not
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email is not exist"
            })
        }

        const isMatchPass = await bcrypt.compare(password, user.password)
        if (!isMatchPass) {
            return res.status(400).json({
                success: false,
                message: "Email and password is not valid"
            })
        }
        const refreshToken = await generateRefreshToken(user?.id)
        const updateUser = await userModel.findByIdAndUpdate(user.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            success: true,
            message: "User Login Successful", token: generateToken(user?._id),
            _id: user?.id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile,
            password: user?.password,
        }
        )

    }
    catch (error) {
        console.log(error);

        return res.json({

            success: false,
            message: "Error Login User",
            error: error.message
        })
    }
})
 



// Get All user

export const getAll = asyncHandler(async (req, res) => {
    try {
        const getUser = await userModel.find()
        return res.status(200).json({
            getUser
        })
    }
    catch (error) {
        return res.status({
            success: false,
            message: "Error Fetching user details",
            error: error.message
        })
    }
})


// Get Single User by id

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    console.log("Received User ID:", id);  // Log the ID to verify
    
    validateMongoDbId(id)

    try {
        const user = await userModel.findById(id)
        console.log(user);

        return res.status(200).json({
            getUser: user
        })
    }
    catch (error) {
        console.log(error);

        throw new Error(error)
    }
})



// handle refresh Token 

export const handleRefreshToken = asyncHandler(async(req,res)=>{
    console.log("running",handleRefreshToken);
    
const cookies = req.cookies
console.log(cookies);

if(!cookies?.refreshToken) 
{
    throw new Error("No Refresh token in Cookies")
}
    const refreshToken = cookies.refreshToken
    console.log(refreshToken);
    
    const user = await userModel.findOne({ refreshToken})

    if(!user)
         {
        throw new Error ("No Refresh token in db or not matched")
         }
        //  verify the token
        jwt.verify(refreshToken, process.env.SECRET_KEY, (err,decoded)=>{
    if(err || user._id.toString() !== decoded.id){
        throw new Error ("There is something wrong with refresh token")
    }
    // Generate a new access token
    const accessToken = generateToken(user?._id)
    res.json({accessToken})
        })
})




// Update User by id

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user
    validateMongoDbId(id)

    try {
        const userExist = await userModel.find({ _id: id })
        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        const user = await userModel.findByIdAndUpdate(
            id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        )
        return res.json({
            success: true,
            message: "User Updated Successfully",
            record: user
        })

    }
    catch (error) {
        throw new Error(error)
    }
})



// delete User by id

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const user = await userModel.findByIdAndDelete(id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({

            status: true,
            message: "User deleted Successfully",
            record: user
        })
    }
    catch (error) {
        throw new Error(error)
    }
})


export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const block = await userModel.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        )
        return res.status(200).json({
            success: true,
            message: "User Blocked Successfully",
            record: block,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

export const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const unblock = await userModel.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        )
        return res.status(200).json({
            success: true,
            message: "User Unblocked Successsfully",
            record: unblock

        })
    }
    catch (error) {
        throw new Error(error)
    }
})