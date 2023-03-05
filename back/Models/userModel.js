const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    account:{
        type:String,
    },
    createdat:{
        type:Date,
        default:Date.now
    }

})

const User = mongoose.model('Users',userModel)

module.exports = User