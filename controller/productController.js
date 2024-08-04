import fs from 'fs'
import orderModels from '../models/orderModels.js';

import productModels from '../models/productModels.js'
import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';
import braintree from 'braintree'
import dotenv from 'dotenv'
dotenv.config()

/// payment gateway

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: `${process.env.MERCHANT_ID}`,
    publicKey: `${process.env.PUBLIC_KEY}`,
    privateKey: `${process.env.PRIVATE_KEY}`,
  });

export const productController=async(req,res)=>{
try {
    const{name,slug,description,price,category,quantity,shipping}=req.fields
    const {photo}=req.files;
    switch (true) {
         case !name:
            return res.status(500).send({message:"Name is Required"})
         case !description:
            return res.status(500).send({message:"description is Required"})
         case !price:
            return res.status(500).send({message:"price is Required"})
         case !category:
            return res.status(500).send({message:"category is Required"})
         case !quantity:
            return res.status(500).send({message:"quantity is Required"})
         case photo && photo.size>1000000:
            return res.status(500).send({message:"Phote is Required and should be less than 1mb"}) 
            
    }
    const products=await new productModels({...req.fields,slug:slugify(name)})
    if(photo){
        products.photo.data=fs.readFileSync(photo.path)
        products.photo.contentType=photo.type
    }
    await products.save();
    res.status(200).send({
        success:true,
        message:"Product created successfully",
        products

    })
} catch (error) {
    res.status(500).send({
        success:false,
        message:"Error in creating Products",
        error
    })
}
}

export const getproductController=async(req,res)=>{
    try {
        const products=await productModels.find({})
        .populate('category').select("-photo")
        .limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"Displaying products",
            products
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in getting Products",
            error
        })
    }
}
export const getsingleroductController=async(req,res)=>{
    try {
        const products=await productModels.findOne({slug:req.params.slug}).populate('category').select("-photo")
        res.status(200).send({
            success:true,
            message:"Display product",
            products,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in getting single Product",
            error
        })
    }
    
}
export const getproductphotoController=async(req,res)=>{
    try {
        const products=await productModels.findById(req.params.pid).select("photo")
        if(products.photo.data){
            res.set("Content-Type",products.photo.contentType)
          return  res.status(200).send(products.photo.data)
        }
       
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in fetching Product photo",
            error
        })
    }
}
////// update product
export const updateproductController=async(req,res)=>{
    try {
        const{name,slug,description,price,category,quantity,shipping}=req.fields
        const {photo}=req.files;
        switch (true) {
             case !name:
                return res.status(500).send({message:"Name is Required"})
             case !description:
                return res.status(500).send({message:"description is Required"})
             case !price:
                return res.status(500).send({message:"price is Required"})
             case !category:
                return res.status(500).send({message:"category is Required"})
             case !quantity:
                return res.status(500).send({message:"quantity is Required"})
             case photo && photo.size>1000000:
                return res.status(500).send({message:"Phote is Required and should be less than 1mb"}) 
                
        }
        const products=await productModels.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(200).send({
            success:true,
            message:"Product  updated successfully",
            products,
    
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error while updating Products",
            error
        })
    }
  

}
  /////delete product
  export const deleteproductController=async(req,res)=>{
    try {
        const product=await productModels.findByIdAndDelete(req.params.pid).select("photo")
        res.status(200).send({
            success:true,
            message:"Product deleted successfully",
            product
            

        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error while updating Products",
            error
        })
    }
  }
  export const filterController=async(req,res)=>{
    try {
        const{checked,radio}=req.body;
        let arg={}
        if(checked.length>0) arg.category=checked
        if(radio.length) arg.price={$gte: radio[0],$lte:radio[1]}
        const product=await productModels.find(arg)
        res.status(200).send({
            success:true,
            message:"Product filter successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error while filtering",
            error
        })
    }
  }
  export const productcountController=async(req,res)=>{
    try {
        const total=await productModels.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        res.status(500).send({
            message:"Error in count ",
            success:false,
            error
        })
    }
  }
  export const productlistController=async(req,res)=>{
    try {
        const perPage=3;
        const page=req.params.page ? req.params.page : 1;
        const products=await productModels.find({}).select("-photo")
        .skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        res.status(400).send({
            message:"Error in listing ",
            success:false,
            error
        })
    }
  }
  export const productsearchFilter=async(req,res)=>{
    try {
        const {keyword}=req.params
        const results=await productModels.find({$or:[
            {name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:"i"}}]}).select("-photo")
        res.json(results)
        
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"No product found",
            error
        })
    }
  }
  export const relatedproduct=async(req,res)=>{
    try {
        const{pid,cid}=req.params;
        const products=await productModels.find({
         category: cid,
         _id:{$ne:pid},
        }).select("-photo").limit(3).populate('category')
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            error
        })
    }
  }


  export const productcategoryController=async(req,res)=>{
    try {
        const category=await categoryModel.findOne({slug:req.params.slug})
        const product=await productModels.find({category}).populate('category')
        
        res.status(200).send({
            success:true,
            category,
            product,
            
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            error,
            message:"Error while Getting Product "
        })
    }
  }
  export const braintreetokenController=async(req,res)=>{
   try {
    gateway.clientToken.generate({},function(err,responce){
        if(err){
            res.status(500).send(err)
        }else{
            res.send(responce)
        }
    });
   } catch (error) {
    console.log(error)
   }
  };
 
  export const braintreepaymentController=async(req,res)=>{
   try {
    const{cart,nonce}=req.body;
    let total=0;
    cart.map((i)=>{total +=i.price})
    let newTransaction=gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true
        },
    },
    function (error,result){
        if(result){
            const order=new orderModels({
                products:cart,
                payment:result,
                buyer:req.user._id
            }).save()
            res.json({ok:true})

        }else{
            res.status(500).send(error)
        }
    }
    )
} catch (error) {
    console.log(error)
   }
  }
export const orderController=async(req,res)=>{
    try {
        const orders=await orderModels.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
   
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error While Fetching Orders",
            error
        })
    }
}