import express from 'express';
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';
import { categoryController ,updateContoller,getcategoryContoller,getsinglecategoryContoller,deleteCategory} from '../controller/categoryController.js';
const router=express.Router()
router.post("/create-category",requireSignin,isAdmin,categoryController)
router.put("/update-category/:id",requireSignin,isAdmin,updateContoller)
router.get("/get-category",getcategoryContoller)
router.get("/single-category/:slug",getsinglecategoryContoller)
router.delete("/delete-category/:id",requireSignin,isAdmin,deleteCategory)



export default router;