import express from 'express';
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';
import { productController,getproductController,getsingleroductController,getproductphotoController,
    updateproductController,deleteproductController,filterController, 
    productcountController,
    productlistController,
    productsearchFilter,
    relatedproduct,productcategoryController,
    braintreetokenController,
    braintreepaymentController,
    } from '../controller/productController.js';
import formidable from 'express-formidable'
const router=express.Router()
router.post("/create-product",requireSignin,isAdmin,formidable(),productController)
//get all products
router.get("/get-product",getproductController)
/// get single products
router.get("/get-product/:slug",getsingleroductController)
// get photo
router.get("/product-photo/:pid",getproductphotoController)
// update procut
router.put("/update-product/:pid",requireSignin,isAdmin,formidable(),updateproductController)
// delete product
router.delete('/delete-product/:pid',requireSignin,isAdmin,deleteproductController)
router.post('/filter-product',filterController)
///// product count
router.get('/product-count',productcountController)
///// product list
router.get("/product-list/:page",productlistController)
//Search filter
router.get('/search/:keyword',productsearchFilter)
router.get('/related/:pid/:cid',relatedproduct)

router.get('/product-category/:slug',productcategoryController)

//payment gateway
//token
router.get('/braintree/token',braintreetokenController)
//payment
router.post('/braintree/payment',requireSignin,braintreepaymentController)

export default router