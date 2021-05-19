const mongoose = require("mongoose")
const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    role:{
        type:String
    },
    password:{
        type:String
    },
    createdBy:{
        type:String
    },
    className:{
        type:String
    },
    classId:{
        type:String
    }
},{timestamps:true})

const User=mongoose.model("User",userSchema)
module.exports=User