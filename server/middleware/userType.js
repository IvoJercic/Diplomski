const jwt=require("jsonwebtoken")
const User=require("../model/user")

const userType=(req,res,next)=>{
    const token=req.cookies.jwt;
    const id=req.cookies.id;
    //provjeri da token postoji i da je valjan
    if(token){
        jwt.verify(token,"secretValue",(err,decodedToken)=>{
            if(err){
                console.log(err.message);                
                res.redirect("/");
            }
            else{
                User.findOne({_id:id}).then(user=>{
                    next();
                })                
            }
        })
    }
    else{
        res.redirect("/");
    }
}

module.exports=userType