import express from 'express'
import { cancelOrder, createOrder, fulfilOrder, getAllOrders } from '../controllers/ordersController.js'


const ordersRouter = express.Router()

ordersRouter.get('/',getAllOrders)
ordersRouter.patch('/:orderId/fulfil',fulfilOrder)
ordersRouter.patch('/:orderId/cancel',cancelOrder)
ordersRouter.post('/',createOrder)

export default ordersRouter