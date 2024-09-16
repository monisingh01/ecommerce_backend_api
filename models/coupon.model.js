import mongoose from "mongoose"
 
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        requied:true,
        unique:true,
        uppercase:true,
    },
    expire:{
        type:Date,
        required:true,
    },
    discount:{
          type:Number,
          required:true,
    },
})


export default mongoose.model ('coupon',couponSchema)