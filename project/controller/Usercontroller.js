import{ catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/UserSchema.js";
import {generateToken} from "../utils/jwtTokens.js";
import cloudinary from "cloudinary";

export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const{firstName,lastName,email,password,phone,gender,dob,bg,role}=req.body;

if(!firstName || !lastName || !email || !password || !phone || !gender || !dob || !bg || !role){
    return next(new ErrorHandler("Please fill full form",400))
}
let user=await User.findOne({email});
if(user){
    return next(new ErrorHandler("User Already Registered",400))
}
user=await User.create({firstName,lastName,email,password,phone,gender,dob,bg,role})
generateToken(user,"User Registered",200,res)

});


export const login=catchAsyncError(async(req,res,next)=>{
    const{email,password,confirmPassword,role}=req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please fill all details",400))
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password not matching",400))
    }

    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Password or email ",400))
    }
    const isPasswordMatched= await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password or email ",400))
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found ",400))
    }

    generateToken(user,"User Logged In Successfully",200,res)

});

export const addNewAdmin=catchAsyncError(async(req,res,next)=>{
    const{firstName,lastName,email,password,phone,gender,dob,bg}=req.body;
    if(!firstName || !lastName || !email || !password || !phone || !gender || !dob || !bg ){
        return next(new ErrorHandler("Please fill full form",400))
    }
    const isRegisterd=await User.findOne({email});
    if(isRegisterd){
        return next(new ErrorHandler(`${isRegisterd.role} with this email already exist`))
    }
    const admin=await User.create({firstName,lastName,email,password,phone,gender,dob,bg,role:"Admin"});
    res.status(200).json({
        success:true,
        message:"New Admin Registered"
    });
})

export const getAllDoctors=catchAsyncError(async(req,res,next)=>{
    const doctors=await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
});

export const getUserDetails=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    })
});

export const logoutAdmin=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now())
    }).json({
        status:true,
        message:"Admin Logged Out Successfully"
    })
})

export const logoutPatient=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(Date.now())
    }).json({
        status:true,
        message:"User Logged Out Successfully"
    })
});

export const addNewDoctor=catchAsyncError(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required ",400))
    }
    const {docAvatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("Files Format not supported, please provide png or jpeg ",400))
    }
    const{firstName,lastName,email,password,phone,gender,dob,bg,doctorDepartment}=req.body;
    if(!firstName || !lastName || !email || !password || !phone || !gender || !dob || !bg || !doctorDepartment){
        return next(new ErrorHandler("Please provide complete details",400))
    }
    const isRegisterd=await User.findOne({email});
    if(isRegisterd){
        return next(new ErrorHandler(`${isRegisterd.role} already Registered with this email`,400))
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error: ",cloudinaryResponse.error || "Unknown Cloudinary response")
    };

    const doctor =await User.create({firstName,lastName,email,password,phone,gender,dob,bg,doctorDepartment,role:"Doctor",docAvatar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    }});
    res.status(200).json({
        success:true,
        message:"New Doctor Registered",
        doctor
    });
});


export const getTotalDoctors = catchAsyncError(async (req, res, next) => {
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    res.status(200).json({
        success: true,
        totalDoctors: totalDoctors
    });
});