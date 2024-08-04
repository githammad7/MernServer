import JWT from 'jsonwebtoken'
import userModels from '../models/userModels.js';
export const requireSignin=async(req,res,next)=>{
    try {
        const decode=await JWT.verify(req.headers.authorization,process.env.SECRRET_KEY)
        req.user=decode
        next();
    } catch (error) {
        console.log(error)
    }

}
/// admin access
export const isAdmin=async(req,res,next)=>{
    try {
        const user=await userModels.findById(req.user._id)
        if(user.role!==1){
            res.status(401).send({
                success:false,
                message:"Unauthorize Access",

            })
        }else{
            next()
        }
        
    } catch (error) {
        res.status(401).send({
            success:false,
            message:"Error in admin",
        })
    }
}