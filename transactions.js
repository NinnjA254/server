import models from './models.js'

//orders
/**
 * createOrder(async):
 * params: customerInfo - an object, containing the details of the customer making order
 *          productInfo - an array of objects, each containing the product name, and quantity ordered
 * returns: orderId. note: it is async so return is in form of a promise
 * 
 * fulfilOrder(async):
 * params: order- a models.Order instance, 
 * returns: a message detailing how order fulfilling went
 *  **/
export async function createOrder(customerInfo,productInfo){ 
    
    const productArray = []
    const customer = await models.Customer.findOne({firstName:customerInfo.fn,lastName:customerInfo.ln})
   

    for (let info of productInfo){
        const product = await models.Product.findOne({name:info.name})
        if(product && product.quantity >= info.quantity){
            productArray.push({
                productId:product._id.toString(),
                quantitySold:info.quantity
            })
        }
        else {
            //console.log(`${info.name} does not exist or quantity is less in inventory`)
            throw new Error(`createOrder:${info.name} does not exist or quantity is less in inventory`)
        }
    }
    console.log("code has passed for loop")
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
        return order._id
    }
    else{
        const newCust = new models.Customer({
            firstName:customerInfo.fn,
            lastName: customerInfo.ln
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
        return order._id
    } 
}
export async function fulfilOrder(orderId){
    const order = await models.Order.findOne({_id:orderId})
    if(!order){
        throw new Error(`No order of that Id exists`)
    }
    if(order.orderStatus === false){
        for(let item of order.itemsSold){
            const qty = item.quantitySold
            const product = await models.Product.findOne({_id:item.productId})
            product.quantity -= qty
            await product.save().catch(err => console.log(err)) // possible optimisation: move this product.save outside of the for loop
            //console.log(product)
        }
        order.orderStatus = true
        await order.save().catch(err => console.log(err))
        return "order has been fulfilled"
    }
    else if(order.orderStatus === true){
        return "the order you are trying to fulfill was already fulfilled"
    } 
}
export async function cancelOrder(orderId){
    const order = await models.Order.findOne({_id:orderId})
    if(!order){
        throw new Error(`No order of that Id exists`)
    }
    if(order.orderStatus === false){
        await models.Order.deleteOne({_id:orderId})
        return 'order cancelled'
    }
    else{
        throw new Error("This order has already been fulfilled. It cannot be cancelled")
    }
}

//acquisitions
/** 
 * createAcquisition: same logic as createOrder, except with acquisitions
 * 
 * completeAcquisition: same logic as fulfilOrder, except with acquisitions
 * **/
export async function createAcquisition(supplierInfo,productInfo){
    
    const productArray = []
    const supplier = await models.Supplier.findOne({firstName:supplierInfo.fn,lastName:supplierInfo.ln})
   

    for (let info of productInfo){
        const product = await models.Product.findOne({name:info.name})
        if(product){
            productArray.push({
                productId:product._id.toString(),
                quantityAcquired:info.quantity
            })
        }
        else {
            //console.log(`${info.name} does not exist or quantity is less in inventory`)
            throw new Error(`createAcquisition:${info.name} does not exist in inventory`)
        }
    }
    console.log("code has passed for loop")
    //check that customer exists
    if(supplier){
        //create a new order
        const acquisition = new models.Acquisition({
            time:Date.now(),
            supplierId:supplier._id.toString(),
            itemsAcquired:productArray,
            acquisitionStatus:false
        })
        await acquisition.save().catch(err => console.log(err))
        console.log("acquisition has been made with existing supplier")
        return acquisition._id
    }
    else{
        const newSupplier = new models.Supplier({
            firstName:supplierInfo.fn,
            lastName: supplierInfo.ln
        })
        await newSupplier.save().catch(err => console.log(err))
        
        const acquisition = new models.Acquisition({
            time:Date.now(),
            supplierId:newSupplier._id.toString(),
            itemsAcquired:productArray,
            acquisitionStatus:false
        })
        await acquisition.save().catch(err => console.log(err))
        console.log("acquisition success, created new supplier!")
        return acquisition._id
    } 
}
export async function completeAcquisition(acquisitionId){ 
    const acquisition = await models.Acquisition.findOne({_id:acquisitionId})
    if(!acquisition){
        throw new Error(`No acquisition of that Id exists`)
    }
    if(acquisition.acquisitionStatus === false){
        for(let item of acquisition.itemsAcquired){
            const qty = item.quantityAcquired
            const product = await models.Product.findOne({_id:item.productId})
            product.quantity += qty
            await product.save().catch(err => console.log(err)) // possible optimisation: move this product.save outside of the for loop
            //console.log(product)
        }
        acquisition.acquisitionStatus = true
        await acquisition.save().catch(err => console.log(err))
        return "acquisition has been completed"
    }
    else if(acquisition.acquisitionStatus === true){
        return "the acquisition you are trying to complete was already completed"
    } 
    // else{
    //     return "the acquisition you're trying to complete is sus,check it again"
    // }  
}
export async function cancelAcquisition(acquisitionId){
    const acquisition = await models.Acquisition.findOne({_id:acquisitionId})
    if(!acquisition){
        throw new Error(`No acquisition of that Id exists`)
    }
    if(acquisition.acquisitionStatus === false){
        await models.Acquisition.deleteOne({_id:acquisition._id})
        return 'acq cancelled'
    }
    else{
        throw new Error("This acquisition has already been completed. It cannot be cancelled")
    }
}

//inspections
/**
 * logInspection: 
 * params: itemsDamaged - an array of objects, each containing information
   of a product(productName atm) and its 
   quantity that was damaged in storage.
 *  **/
export async function logInspection(itemsDamaged,report){
    const itemsArray = []
    const productArray = [] //products must be saved after validation of every product, thus stored here to be iterated over and saved later
    for (let item of itemsDamaged){
        const product = await models.Product.findOne({name:item.name})
        if(product && product.quantity >= item.quantity){
            product.quantity -= item.quantity
            itemsArray.push({
                productId:product._id.toString(),
                quantityDamaged:item.quantity
            })
            productArray.push(product)
        }
        else {
            //console.log(`${item.name} does not exist in inventory or quantity damaged is greater than in store`)
            throw new Error(`logInspection:${item.name} does not exist in inventory or quantity damaged is greater than in store`)
        }
    }
    const newInspection = new models.Inspection({
        time: Date.now(),
        itemsDamaged: itemsArray,
        report: report
    })
    await newInspection.save()
    //saving the product changes into mongodb
    for (let product of productArray){
        await product.save()
    }
    console.log('inspection done')
}




