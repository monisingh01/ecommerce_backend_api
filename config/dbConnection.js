  import mongoose from "mongoose";


  const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)

        console.log("Database connected Successfully");
        
    }
    catch(error){

console.log("Database Error");


    }
  }

  export default dbConnect
  

