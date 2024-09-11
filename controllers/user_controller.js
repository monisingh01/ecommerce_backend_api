import userModel from "../models/user_model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from "../utils/validate_mongodbId.js"
import crypto from 'crypto';
import { generateToken } from "../config/jwtToken.js"
import { generateRefreshToken } from "../config/refreshToken.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "./email_controller.js";



// User Register
export const register = asyncHandler(async (req, res, next) => {
    try {

        const { email, password } = req.body
        // console.log("",req.body);

        // const hashedPassword = await bcrypt.hash(password, 10)


        const findUser = await userModel.findOne({ email })
        if (!findUser) {
            // Create a new User
            const newUser = await userModel.create(req.body)
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
        if (user && await user.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken
        ( user?.id)
        const updateUser = await userModel.findByIdAndUpdate(
            user.id,
            {
                refreshToken: refreshToken,
            },
            { 
                new: true
            })
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
            token: generateToken(user._id),
        })
    }
    else{
        res.status(401).json({
            success:false,
            message: "Invalid credentials"
        })
    }
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

    validateMongodbId(id)

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

export const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log("running", handleRefreshToken);

    const cookies = req.cookies
    console.log(cookies);

    if (!cookies?.refreshToken) {
        throw new Error("No Refresh token in Cookies")
    }
    const refreshToken = cookies.refreshToken
    console.log(refreshToken);

    const user = await userModel.findOne({ refreshToken })

    if (!user) {
        throw new Error("No Refresh token in db or not matched")
    }
    //  verify the token
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        // Generate a new access token
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
})



// logout Functionality
export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) {
        throw new Error("No refresh token in cookies")
    }
    const refreshToken = cookies.refreshToken
    const user = await userModel.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httponly: true,
            secure: true,
        })
        return res.sendStatus(204)   //forbidden
    }
    await userModel.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    })
    res.clearCookie("refreshToken", {
        httponly: true,
        secure: true,
    })
    return res.sendStatus(204)   //forbidden

})



// Update User by id

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user
    validateMongodbId(id)

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
    validateMongodbId(id)

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
    validateMongodbId(id)

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
    validateMongodbId(id)

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


export const updatePassword = asyncHandler (async(req,res)=>{
    const {_id} = req.user
    const {password} = req.body // Destructuring to get the pasword from req.body
    validateMongodbId(_id)
    const user = await userModel.findById(_id) // Retrive the user document

    if(password){
        user.password = password // Update the password fields
        const updatePassword = await user.save() // save the updated document
        res.json(updatePassword) // send the updated user document as a response
    } else{
        res.json(user) // If no password is provided, return the user document as is
    }
})


export const forgetPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const userEnter = await userModel.findOne({ email })
    if(!userEnter) {
        throw new Error("User not Found with this mail id")
    }
    try{
const token = await userEnter.createPasswordResetToken()
await userEnter.save()

const resetPasswordUrl = `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #2c3e50;">
    <h2 style="color: #3498db;">Hey ${userEnter.firstname || 'there'},</h2>
    <p>Forgot your password? No problem! Let's get you back into Quinn, shall we?</p>
    <p>Click the link below to reset your password:</p>
    <p style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:4000/api/user/reset-password/${token}" 
           style="background-color: #3498db; color: #ffffff; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
           Reset Your Password
        </a>
    </p>
    <p>Heads up: this link is only valid for the next 10 minutes. Act fast!</p>
    <p>If you didn't request this, you can safely ignore this email—no action needed.</p>
    <p>Cheers,<br/>The Quinn Team</p>
    <footer style="margin-top: 40px; color: #95a5a6; font-size: 14px;">
        <p>Need assistance? <a href="http://localhost:5000/support" style="color: #3498db;">We're here to help</a></p>
        <p>Quinn © 2024 - All rights reserved</p>
    </footer>
</div>
`;  
const data = {
    to: email,
    text: "hey user",
    subject: "Forget Password Link",
    html: resetPasswordUrl,
}
sendEmail(data);
res.status(201).json({
    msg: "Massage send successfully"
})
}catch(error){

    console.log(error);
    
throw new Error(error);

}
})


export const resetPassword = asyncHandler(async(req,res)=>{
    const{password} = req.body
    const {token} = req.params

    // Hash the token to compare with the stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")

    // FInd the userwith the matching token and a valid expiration date
    const userEnter = await userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })

    if(!userEnter) {
        res.status(400).json({
            success : false,
            message:"Token Expires or Invalid Please try again"
        })
        return
    }
    userEnter.password =  password

    userEnter.passwordResetToken = undefined
    userEnter.passwordResetExpires = undefined
    await userEnter.save()

    res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
})

