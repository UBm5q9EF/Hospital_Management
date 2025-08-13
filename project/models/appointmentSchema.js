import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Provide a Valid Email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Number should be exactly 10"],
        maxLength:[10,"Number should be exactly 10"]
    },
   dob:{
    type:Date,
    required:true,
   },

   gender:{
    type:String,
    required:true,
    enum:["Male","Female","Other"]
   },

   bg:{
    type:String,
    required:true,
    enum:["AB+","AB-","A+","A-","B+","B-","O+","O-"]
   },
    
   appointment_date:{
    type:String,
    required:true,
   },

   department:{
    type:String,
    required:true,
   },

   doctor:{
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    }
   },

   hasVisited:{
    type:Boolean,
    default:false,
   },

   appointmentTime: {
    type: String, 
    required: true
},
    appointmentCharge:{
    type: String,
    required:true
},

   doctorId:{
    type:mongoose.Schema.ObjectId,
    required:true,
   },

   patientId:{
    type:mongoose.Schema.ObjectId,
    required:true,
   },

   address:{
    type:String,
    required:true,
   },

   status:{
    type:String,
    enum:["Pending","Accepted","Rejected"],
    default:"Pending"
   }
});

export const Appointment= mongoose.model("Appointment",appointmentSchema);
