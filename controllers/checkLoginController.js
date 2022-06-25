export async function checkLoginController(req,res){
    if(!req.session.employee)return res.json(false) //not logged in
    res.json(true) //logged in
}