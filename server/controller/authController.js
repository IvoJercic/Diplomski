const User=require("../model/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const Class=require("../model/class")
//Stvara novog usera
exports.register = async(req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty !" });
        return;
    }

    const password = req.body.email.split("@")[0]+"123";
    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    const cookie=req.cookies;
    const parentId=cookie["id"]

  
    console.log(req.body.class);
    
    //Stvaranje novog usera
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        password:hashedPassword,
        createdBy:parentId,
        classId:req.body.classId,
        className:req.body.className
    })
    //console.log("SPREMAMO OVO: "+user);
    

    //Spremanje novog usera u bazu
    user
        .save(user)
        .then(data => {
            //res.send(data)
            res.redirect("/add-user");
            // res.status(200).send({
            //     message:"Uspjesno spremljeno"
            // })
            console.log(("User registrated successfully !"));
            
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating a create operation"
            })
        })
}

exports.registerClass = async(req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty !" });
        return;
    }

    const cookie=req.cookies;
    const parentId=cookie["id"]

    
  
    //Stvaranje novog usera
    const classRoom=new Class({
        admin:parentId,
        name:req.body.name
    })

    classRoom
        .save(classRoom)
        .then(data => {
            //res.send(data)
            res.redirect("/add-class");
            console.log(("Class added successfully !"));
            
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating a create operation"
            })
        })
}

exports.login=async(req,res)=>{

    //validate request
    if (!req.body) {
        
        res.status(400).send({ message: "Content can not be empty !" });
        return;
    }

    var username=req.body.email
    var password=req.body.password


    User.findOne({email:username})
    .then(user=>{
        //console.log("TRAZIM OVAJ USER; "+username);
        
        if(user){
            //console.log("SIFRA: "+password);
            
        
            bcrypt.compare(password,user.password,function(err,result){
                if(result){
                    let token=jwt.sign({name:user.name},"secretValue",{expiresIn:"1h"});
                    //res.header("auth-token",token).send(token)
                    //console.log("TOKEN JE:"+ token);
                    res.cookie("jwt",token,{httpOnly:true})
                    res.cookie("id",String(user._id))

                    res.redirect("/index");
                }
                else{
                    res.redirect("/");
                }
            })
        }
        else{
            //console.log("NEISPRAVNI USER");
            res.redirect("/");
        }
    })
}

exports.logout=async(req,res)=>{
    res.cookie("jwt","",{maxAge:1})
    res.cookie("id","",{maxAge:1})

    res.redirect("/")
    //res.status(200).send("Uspjesno smo se odjavili!");
    console.log("ODJAVISMO SE");
    
}