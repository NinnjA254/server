import models from '../models.js'
import mongoose from 'mongoose'


export async function getAllOrders(req,res){
    try{
        const orders = await models.Order.find().populate('customerId','firstName lastName -_id').populate('itemsSold.productId','name -_id')
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

export async function createOrder(req,res){ 
    const customerInfo = req.body.customerInfo
    const productInfo = req.body.productInfo
    if(!productInfo||!customerInfo){
        return res.json({
            status:400,
            message:"check your request body",
            data:null
        })
    }

    const productArray = []
    const outOfStock = []
    const customer = await models.Customer.findOne({firstName:customerInfo.firstName,lastName:customerInfo.lastName})

    for (let info of productInfo){
        const product = await models.Product.findOne({_id:info._id})
        if(!product){
            return res.json({
                message:`${info.name} does not exist or quantity is less in inventory`,
                status:404,
                data:null
            })
        }
        if(product.quantity < info.quantity){
            outOfStock.push(product.name)
        }
        if(product && product.quantity >= info.quantity){
            productArray.push({
                productId:product._id.toString(),
                quantitySold:info.quantity
            })
        }
        
    }
    console.log("code has passed for loop")
    if(outOfStock.length > 0){
        return res.json({
            message:`not enough ${outOfStock} in inventory`,
            status:403,
            data:null
        })
    }
    //check that customer exists
    if(customer){
        //create a new order
        const order = new models.Order({
            time:Date.now(),
            customerId:customer._id.toString(),
            itemsSold:productArray,
            orderStatus:false
        })
        await order.save().catch(err => console.log(err))
        console.log("order success with existing user")
        return res.json({
            message:"order successifully created with an existing user",
            status:200,
            data:null
        })
    }
    else{
        const newCust = new models.Customer({
            firstName:customerInfo.firstName,
            lastName: customerInfo.lastName
        })
        await newCust.save().catch(err => console.log(err))
        
        const order = new models.Order({
            time:Date.now(),
            customerId:newCust._id.toString(),
            itemsSold:productArray,
            orderStatus:false
        })
        await order.save().catch(err => console.log(err))
        console.log("order success, created new customer!")
        return res.json({
            message:"order successifully created,created new user",
            status:200,
            data:null
        })
    } 
}

export async function fulfilOrder(req,res){
    const orderId = req.params.orderId
    if(!mongoose.Types.ObjectId.isValid(orderId)) return res.json({
        status:404,
        message:"invalid id",
        data: null
    })
    
    const order = await models.Order.findOne({_id:orderId})
    // console.log(order)
    if(!order){
        return res.json({
            message:"order not found",
            status:404,
            data:null
        })
    }
    if(order.orderStatus === false){
        const productsToSave = []
        const outOfStock = []
        for(let item of order.itemsSold){
            const qty = item.quantitySold
            const product = await models.Product.findOne({_id:item.productId})
            if(product.quantity < qty){
                outOfStock.push(product.name)
            }
            product.quantity -= qty
            productsToSave.push(product)
            // await product.save().catch(err => console.log(err)) // possible optimisation: move this product.save outside of the for loop
            //console.log(product)
        }

        if(outOfStock.length > 0) { //only one thing needs to be out of stock for order to not fulfill
            return res.json({
                message:`not enough ${outOfStock} in inventory`,
                status:403,
                data:null
            })
        }

        for (let product of productsToSave){
            await product.save().catch(err => console.log(err))
        }
        order.orderStatus = true
        await order.save().catch(err => console.log(err))
        return res.json({
            message:"order fulfilled succesfully",
            status:200,
            data:null
        })
    }
    else if(order.orderStatus === true){
        return res.json({
            message:"the order is already fulfilled",
            status:403,
            data:null
        })
    } 
}

export async function cancelOrder(req,res){
    const orderId = req.params.orderId
    if(!mongoose.Types.ObjectId.isValid(orderId)) return res.json({
        status:404,
        message:"invalid id",
        data: null
    })
    const order = await models.Order.findOne({_id:orderId})
    if(!order){
        return res.json({
            message:"order not found",
            status:404,
            data:null
        })
    }
    if(order.orderStatus === false){
        await models.Order.deleteOne({_id:orderId})
        return res.json({
            status:200,
            message:"order cancelled successifuly",
            data: null
        })
    }
    else{
        return res.json({
            message:"fulfilled orders cannot be cancelled",
            status:403,
            data:null
        })
    }
}