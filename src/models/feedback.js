const mongoose = require('mongoose')

const Feedback = mongoose.model('Feedback', {
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
})

module.exports = Feedback