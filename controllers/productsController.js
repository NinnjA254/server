import models from '../models.js'

export async function getAllProducts(req,res){
    try{
        const orders = await models.Product.find()
        res.json({
            status:200,
            message:"success",
            data:orders
        })
    }
    catch(err){
        console.log(err)
    }
    
}