import models from '../models.js'

export default function authorize(allowedRoles){
    return async function(req,res,next){
        if(!req.session.employee) return res.json("you are not logged in")
        const employee = await models.Employee.findById(req.session.employee)
        if(employee.accessAllowed.includes(allowedRoles)) return next()
        return res.json({
            message:"you are not authorized",
            status:403,
            data:null
        })
    }
}