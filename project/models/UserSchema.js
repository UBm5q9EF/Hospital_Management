import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema=new mongoose.Schema({
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
    
   password:{
    type:String,
    required:true,
    minLength:[8,"Password should contain atleast 8 characters"],
    select:false,
   },

   role:{
    type:String,
    required:true,
    enum:["Admin","Patient","Doctor"],
   },

   doctorDepartment:{
    type:String,
   },

   docAvatar:{
    public_id:String,
    url:String,
   }
});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});

UserSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

UserSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn :process.env.JWT_EXPIRES});
};



export const User=mongoose.model("User",UserSchema);