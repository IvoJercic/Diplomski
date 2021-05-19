const mongoose = require("mongoose")
const Schema=mongoose.Schema

const answerSchema=new Schema({
    user:{
        type:String
    },
    answer:{
        type:String
    },
    classId:{
        type:String
    }
},{timestamps:true})

const Answer=mongoose.model("Answer",answerSchema)
module.exports=Answer