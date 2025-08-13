import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../main";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated, user } = useContext(Context); // Assuming user object contains patient details including their ID

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/patient`, // Assuming the API endpoint to fetch appointments by patient ID is /api/v1/appointment/patient/:patientId
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    
    if (isAuthenticated && user && user._id) { // Ensure user is authenticated and has an ID
      fetchAppointments();
    }
  }, [isAuthenticated, user]); // Trigger effect on authentication status or user changes

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page my-appointments messages" style={{ paddingTop: "150px", paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px", marginLeft: "auto", marginRight: "auto", textAlign: "center", width: "fit-content" }}>My Appointments</h1>
      <div className="appointments-list" style={{ width: "80%", margin: "0 auto" }}>
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div className="appointment-card" key={appointment._id} style={{ width: "100%" }}>
              <div className={`details patient-${index + 1}`}>
                <p>
                  <strong>Patient First Name:</strong> {appointment.firstName}
                </p>
                <p>
                  <strong>Patient Last Name:</strong> {appointment.lastName}
                </p>
                <p>
                  <strong>Appointment Date:</strong> {appointment.appointment_date}
                </p>
                <p>
                  <strong>Appointment Time:</strong> {appointment.appointmentTime}
                </p>
                <p>
                  <strong>Doctor Name:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName}
                </p>
                <p>
                  <strong>Appointment Charges:</strong> {appointment.appointmentCharge}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2>No Appointments!</h2>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;
