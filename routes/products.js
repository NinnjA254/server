import express from 'express'
import { getAllProducts } from '../controllers/productsController.js'

const productsRouter = express.Router()

productsRouter.get('/',getAllProducts)

export default productsRouter