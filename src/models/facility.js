const mongoose = require('mongoose');


const facilitySchema = new mongoose.Schema( {
    name:{
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type: String,
        required:true
    },
    facility_type:{
        type: String,
        required:true
    },
    card_type:{
        type: String,
        required:true
    },
    governorate:{
        type: String,
        required:true
    },
    city:{
        type: String,
        required:true
    },
    area:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required:true
    },
    discount:{
        type: Number,
        required:true
    },
    priority_number:{
        type: Number,
        required:true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
   
    location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2d'
        }
      },
facebook:{
    type:String,
    default:''
},
twitter:{
    type:String,
    default:''
},instagram:{
    type:String,
    default:''
},
website:{
    type:String,
    default:''
}
})
facilitySchema.pre('save', async function (next) {
    const facility = this
    facility.name= facility.name.toLowerCase()
    facility.city= facility.city.toLowerCase()



    next()
})

const Facility= mongoose.model('Facility',facilitySchema)
module.exports = Facility