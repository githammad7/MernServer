import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const categoryController=async(req,res)=>{
   try {
    const{name}=req.body;
    if(!name){
       return res.status(401).send({message:"Name is Required"})
    }
    const existingCategory=await categoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category already present",
            error,
        })
    }
   const category=await new categoryModel({name,slug:slugify(name)}).save()
   res.status(201).send({
    success:true,
    message:"Category created successfully",
    category
   })

   } catch (error) {
    res.status(500).send({
        success:false,
        message:"Error in Category",
        error
    })
   }
}
export const updateContoller=async(req,res)=>{
    try {
        const{name}=req.body;
    const{id}=req.params;
    const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
    res.status(201).send({
        success:true,
        message:"Update Successfully",
        category
    })
    } catch (error) {
        res.status(500).send({
            success:false,
        message:"Error while updating  Category",
        error
        })
    }
    
    
}
export const getcategoryContoller=async(req,res)=>{
    try {
        {
            const getcategory=await categoryModel.find({})
            res.status(200).send({
                success:true,
                message:"All Categories",
                getcategory
            })}
    } catch (error) {
        res.status(500).send({
            success:false,
        message:"Error while displaying  Category",
        error
        })
    }
}
export const getsinglecategoryContoller=async(req,res)=>{
    try {
        const singlecategory=await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"display single category",
            singlecategory
        })
    } catch (error) {
        res.status(500).send({
            success:false,
        message:"Error while displaying  Category",
        error
        })
    }
}
export const deleteCategory=async(req,res)=>{
    try {
        const{id}=req.params
        const category=await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Deleted Successfully",
            category
        })
    } catch (error) {
        res.status(500).send({
            success:false,
        message:"Error while deleting  Category",
        error
        })
    }
}