const express=require("express")
const route=express.Router()
const jwt=require("jsonwebtoken")

const AuthController=require("../controller/authController")

route.post("/register",AuthController.register)
route.post("/registerClass",AuthController.registerClass)
route.post("/login",AuthController.login)
route.get("/logout",AuthController.logout)
module.exports=route