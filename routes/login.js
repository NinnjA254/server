import express from 'express'
import { loginController } from '../controllers/loginController.js'
import authorize from '../middlewares/authorize.js'

const loginRouter = express.Router()

loginRouter.post('/', loginController)
loginRouter.get('/', authorize(['orders']),(req,res) =>{
    res.json("authorise works")
})

export default loginRouter