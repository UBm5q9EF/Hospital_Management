import express from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors,getTotalDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from "../controller/Usercontroller.js";
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js"
import { getAllMessages } from "../controller/messageController.js";

const router=express.Router();
router.post("/patient/register",patientRegister)
router.post("/login",login)
router.post("/admin/addNew",isAdminAuthenticated,addNewAdmin)
router.get("/doctors",getAllDoctors)
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails)
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin)
router.get("/patient/logout",isPatientAuthenticated,logoutPatient)
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor)
router.get("/admin/doctorcount",isAdminAuthenticated,getTotalDoctors)





export default router;