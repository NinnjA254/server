import express from 'express'
import {checkLoginController} from '../controllers/checkLoginController.js'

const checkLoginRouter = express.Router()

checkLoginRouter.get('/',checkLoginController)

export default checkLoginRouter