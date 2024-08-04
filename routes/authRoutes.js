import express from "express";
import {isAdmin, requireSignin} from '../middleware/authMiddleware.js'
import {registerController,loginController,testController,forgetController, profileupdateController
    ,orderController,
    adminorderController,
    adminorderstatusController
} from "../controller/authController.js";
const router=express.Router();


router.post('/register',registerController)
router.post('/login',loginController)
router.get('/test',requireSignin,isAdmin,testController)
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
})
router.post('/forget-password',forgetController)
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})
router.put('/profile',requireSignin,profileupdateController)
router.get('/orders',requireSignin,orderController)
router.get('/all-orders',requireSignin,isAdmin,adminorderController)

//order status update
router.put('/orders-status/:orderId',requireSignin,isAdmin,adminorderstatusController)




export default router