const express=require("express")
const route=express.Router()
const services= require("../services/render")

const controller=require("../controller/crudController")
const autentificate=require("../middleware/autentificate")
const userType=require("../middleware/userType")

const jwt=require("jsonwebtoken")

//DIo za renderiranje
route.get("/",services.login) //kad smo na / ruti pozvat cemo services.homeRoutes rutu, ovo je lako za razumit
//route.get("/",services.homeRoutes)
route.get("/add-user",autentificate,services.add_User)
route.get("/add-class",autentificate,services.add_Class)
route.get("/myUsers",autentificate,services.myUsers)
route.get("/myClasses",autentificate,services.myClasses)
route.get("/menu",userType,services.menuRoutes)
route.get("/augmentedReality",autentificate,services.augmentedReality)

route.get("/index",autentificate,services.homeRoutes)
route.get("/update-user",autentificate,services.update_User)
route.get("/view-classroom",autentificate,services.view_classrom)
route.get("/getAnswersByClass",autentificate,services.getAnswers)
route.get("/games",autentificate,services.games)
route.get("/ar/:animal",autentificate,services.arRoutes)


//API

//Upiti na bazu - CRUD svakog korisnika
route.post("/api/users",controller.create)
route.get("/api/users",controller.find)
route.get("/api/classes",controller.findClasses)
route.put("/api/users/:id",controller.update)
route.delete("/api/users/:id",controller.delete)
route.delete("/api/classes/:id",controller.deleteClass)
route.get("/api/studentsByClass",controller.findStudentsByClass)

//Spremamo  za svakog korisnika njegove objave
route.post("/api/addAnswer",controller.addAnswer)
route.get("/api/getAnswers/:id",controller.getAnswers)




//route.post("/register",AuthController.register)



module.exports=route