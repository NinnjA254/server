import models from '../models.js'

export async function loginController(req,res,next){
    if(!req.body.firstName || !req.body.lastName || !req.body.password) return res.json("wrong format credentials")
    const employee = await models.Employee.findOne({firstName:req.body.firstName,lastName:req.body.lastName})
    if(employee){
        if(employee.password === req.body.password){
            req.session.employee = employee._id
            res.json({
                message:"logged in",
                status:200,
                data:""
            })
        }
        else{
            res.json({
                message:"wrong password",
                status:403,
                data:""
            })
        }
    }
    else{
        res.json({
            message:"User does not exist",
            status:404,
            data:""
        })
    }
}