import models from '../models.js'

export async function loginController(req,res,next){
    if(!req.body.firstName || !req.body.lastName || !req.body.password) return res.json("wrong format credentials")
    const employee = await models.Employee.findOne({firstName:req.body.firstName,lastName:req.body.lastName})
    if(employee){
        if(employee.password === req.body.password){
            req.session.employee = employee._id
            res.json("logged in")
        }
        else{
            res.json("wrong password, sus")
        }
    }
    else{
        res.json("user exists not")
    }
}