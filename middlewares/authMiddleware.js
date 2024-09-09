 import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import userModel from "../models/user_model.js"

export const authMiddleware = asyncHandler(async(req,res, next)=>{
    let token 
    if(req?.headers?.authorization?.startsWith('Bearer')) {
token = req.headers.authorization.split(" ")[1]
// console.log("Token",token);

try{
if(token){
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    // console.log("Decoded Token",decoded);
    
    const user = await userModel.findById(decoded?.id)
    // console.log("Decoded ID",decoded.id);
    
    // console.log("user found",user);

    if(!user){
        throw new Error("USer not found")
    }
    
    req.user = user
    next()
    
}
}
catch(error){
    console.log("error : ",error.message);
    
    throw new Error("Not Authorized token expired, Please Login again")
}
    } else{
        throw new Error('There is no token attached to header')
    }
})


export const isAdmin = asyncHandler(async(req,res,next)=>{
 const {email} = req.user
 const adminUser = await userModel.findOne({email})
 if(adminUser.role !== "admin"){
    throw new Error ("You are not an admin")
 }else {
    next()
 }
})