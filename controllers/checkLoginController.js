export async function checkLoginController(req,res){
    if(!req.session.employee)return res.json({
        message:"You are not logged in",
        status:403,
        data:""
    }) //not logged in

    res.json({
        message:"you are logged in",
        status:200,
        data:""
    }) //logged in
}