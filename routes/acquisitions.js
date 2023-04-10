import express from 'express'
import { cancelAcquisition, createAcquisition, fulfilAcquisition, getAllAcquisitions } from '../controllers/acquisitionsController.js'


const acquisitionsRouter = express.Router()

acquisitionsRouter.get('/',getAllAcquisitions)
acquisitionsRouter.patch('/:acquisitionId/fulfil',fulfilAcquisition)
acquisitionsRouter.patch('/:acquisitionId/cancel',cancelAcquisition)
acquisitionsRouter.post('/',createAcquisition)

export default acquisitionsRouter