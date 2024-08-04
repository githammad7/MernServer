import userModels from "../models/userModels.js";
import JWT from 'jsonwebtoken'
import orderModels from "../models/orderModels.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import dotenv from 'dotenv'
dotenv.config()


export  const registerController=async(req,res)=>{
    try {
        const{name,email,password,phone,address,answer}=req.body;
        if(!name){
         return   res.send({message:'name is required'})
        }
        if(!email){
            return   res.send({message:'email is required'})
        }
        if(!password){
            return   res.send({message:'password is required'})
        }
        if(!phone){
            return   res.send({message:'phone is required'})
        }
        if(!address){
            return   res.send({message:'address is required'})
        }
        if(!answer){
            return   res.send({message:'answer is required'})
        }
        const existingUser= await userModels.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"alerady registerd email please login"
            })
        }
        const hashedPassword=await hashPassword(password) 
        const user=await new userModels({name,email,phone,address,password:hashedPassword,answer}).save()
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in registration",
            error
        })
        
    }


}
export const loginController=async(req,res)=>{
    try {
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email And Password",
                
            })
        }
        const user=await userModels.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registerd",
                
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid login details"
                
            })
        }
        const token=await JWT.sign({_id:user._id},process.env.SECRRET_KEY,{
            expiresIn:"7d"
        })
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        })
    }
}
//test controller
export const testController=async(req,res)=>{
    res.send("protected route")
}
export const forgetController=async(req,res)=>{
    try {
        const{email,answer,newpassword}=req.body;
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"answer is required"})
        }
        if(!newpassword){
            res.status(400).send({message:"newpassword is required"})
        }
        const user=await userModels.findOne({email,answer})
        if(!user){
            return res.status(400).send({
                success:false,
                message:"Wrong Email And Answer"
            })
        }
        const hashed=await hashPassword(newpassword)
        await userModels.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something Went Wrong",
            error
        })
    }
}
export const profileupdateController=async(req,res)=>{
    try {
        const{name,email,password,phone,address}=req.body;
        const user=await userModels.findById(req.user._id)
        if(password && password.length < 6){
          return  res.json({error:"Password must be 6 character long"})
        }
        const hashedPassword= password ? await hashPassword(password) : undefined
        const Updateduser=await userModels.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address

        },{new:true})
        res.status(200).send({
            success:true,
            message:"Update Successfully",
            Updateduser,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while updating profile",
            error
        })
    }
}
export const orderController=async(req,res)=>{
    try {
        const orders=await orderModels.find({buyer:req.user._id}).
        populate("products","-photo").populate("buyer","name")
        res.json(orders)
   
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error While Fetching Orders",
            error
        })
    }
}
export const adminorderController=async(req,res)=>{
    try {
        const orders=await orderModels.find({}).
        populate("products","-photo").populate("buyer","name").
        sort({createdAt:-1});
        res.json(orders)
   
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error While Fetching Orders",
            error
        })
    }
}
export const adminorderstatusController=async(req,res)=>{
    try {
        
   const{orderId}=req.params;
   const{status}=req.body;
   const orders=await orderModels.findByIdAndUpdate(orderId,{status},{new:true})
   res.json(orders)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error While Updating Orders",
            error
        })
    }
}

