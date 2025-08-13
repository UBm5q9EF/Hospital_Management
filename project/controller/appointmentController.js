import{ catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/errorMiddleware.js";
import{Appointment} from "../models/appointmentSchema.js";
import {User} from "../models/UserSchema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'ehealthmedicalinstitute@gmail.com',
        pass: 'jsjzcgqgcyxpmonk'
    },
});
  
  const sendAppointmentConfirmationEmail = async (email, firstName, appointmentDate, selectedTime, doctorFirstName, doctorLastName,appointmentCharge) => {
    try {
      await transporter.sendMail({
        from: 'ehealthmedicalinstitute@gmail.com',
        to: email,
        subject: 'Appointment Confirmation',
        text: `Dear ${firstName},\n\nYour appointment has been confirmed.\n\nDate: ${appointmentDate}\nTime: ${selectedTime}\nDoctor: ${doctorFirstName} ${doctorLastName}\nAppointment Charges: ${appointmentCharge}\nThank you.`,
      });
      console.log('Email sent: Appointment confirmation');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

export const postAppointment= catchAsyncError(async(req,res,next)=>{
    const{
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    bg,
    appointment_date,
    appointmentTime,
    department,
    appointmentCharge,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
}=req.body;


if(!firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !bg ||
    !appointmentCharge ||
    !appointment_date ||
    !appointmentTime ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address){
        return next(new ErrorHandler("Please fill Full Form ",400))
    }

    const isConflict = await User.find({
        firstName:doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department,
    })

    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor not found",400))
    }

    if(isConflict.length > 1){
        return next(new ErrorHandler("Doctor's Conflict so find through email",400))
    }

    const existingDoctor = isConflict[0];

    const existingAppointment = await Appointment.findOne({
        appointment_date,
        appointmentTime,
        doctorId: existingDoctor._id,
    });

    if (existingAppointment) {
        return next(new ErrorHandler("Appointment slot already booked for this doctor", 400));
    }

    const patientId=req.user._id;
    const appointment= await Appointment.create( {
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        bg,
        appointment_date,
        appointmentCharge,
        appointmentTime,
        department,
        doctor:{
            firstName:doctor_firstName,
            lastName:doctor_lastName,
        },
        hasVisited,
        address,
        doctorId: existingDoctor._id,
        patientId});

        sendAppointmentConfirmationEmail(email, firstName, appointment_date, appointmentTime, doctor_firstName, doctor_lastName, appointmentCharge);


        res.status(200).json({
            success:true,
            message:"Appointment Scheduled Successfully",
            appointment,
        });
});

export const getAllAppointments=catchAsyncError(async(req,res,send)=>{
    const appointments = await Appointment.aggregate([
        {
            $sort: {
                appointment_date: 1,
                appointmentTime: 1
            }
        }
    ]);
    res.status(200).json({
        success:true,
        appointments,
    })
});

export const updateAppointmentStatus=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404))
    }
    appointment=await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false,
    });
    res.status(200).json({
        success:true,
        message:"Appointment status updated",
        appointment
    })
});

export const getTotalAppointments = catchAsyncError(async (req, res, next) => {
    const totalAppointments = await Appointment.countDocuments();
    res.status(200).json({
        success: true,
        totalAppointments: totalAppointments
    });
});

export const deleteAppointment=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404))
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"appointment deleted",
        appointment
    })
});


export const getPatientAppointments = catchAsyncError(async (req, res, next) => {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patientId }).select("firstName lastName appointment_date appointmentTime doctor appointmentCharge");    res.status(200).json({
        success: true,
        appointments,
    });
});
