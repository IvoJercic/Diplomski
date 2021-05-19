const jwt=require("jsonwebtoken")
const User=require("../model/user")

const requireAuth=(req,res,next)=>{
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
                //Ako je token uredu provjeravamo ima li korisnik ovlasti
                User.findOne({_id:id}).then(user=>{
                    if(user.role!="Ucenik")
                    {
                        next();
                    }
                    else{
                        res.redirect("/menu");
                    }
                })                
            }
        })
    }
    else{
        res.redirect("/");
    }
}

module.exports=requireAuth