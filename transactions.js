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



//acquisitions
/** 
 * createAcquisition: same logic as createOrder, except with acquisitions
 * 
 * completeAcquisition: same logic as fulfilOrder, except with acquisitions
 * **/
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




