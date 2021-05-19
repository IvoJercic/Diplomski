const express=require("express")
const dotenv=require("dotenv")//Skriva osobne varijable
const morgan=require("morgan")//Na konzoli ispusje zahtjeve
const bodyparser=require("body-parser")
const path=require("path")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")

const connectDB=require("./server/database/connection")
const app=express()

dotenv.config({path:"config.env"})
const PORT = process.env.PORT || 8080

//log request
app.use(morgan("tiny"))
app.use(cookieParser())
connectDB();

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))
//set view engine
app.set("view engine","ejs")
//app.set("views",path.resolve(__dirname,"views/ejs"))

//load assets
app.use("/css",express.static(path.resolve(__dirname,"assets/css")))
app.use("/img",express.static(path.resolve(__dirname,"assets/img")))
app.use("/js",express.static(path.resolve(__dirname,"assets/js")))
app.use("/json",express.static(path.resolve(__dirname,"assets/json")))



//Load routers
app.use("/",require("./server/routes/router"))
app.use("/auth",require("./server/routes/authRouter"))



app.listen(PORT,()=>{console.log("Server is running on http://localhost:"+PORT)})