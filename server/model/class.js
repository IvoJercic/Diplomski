const mongoose = require("mongoose")
const Schema=mongoose.Schema

const classSchema=new Schema({
    admin:{
        type:String
    },
    name:{
        type:String
    }
},{timestamps:true})

const Class=mongoose.model("Class",classSchema)
module.exports=Class