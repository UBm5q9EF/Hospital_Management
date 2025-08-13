import React from "react";
const Biography = ({ imageUrl }) => {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="aboutImg" />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who We Are</h3>
        <p>
          Welcome to E-Health Medical Institute, where excellence meets
          compassion in healthcare. We take pride in offering a diverse range of
          specialized departments to cater to your unique medical needs. Our
          dedicated team of professionals ensures that you receive top-notch
          care in a supportive environment.
        </p>
        <p>
          At E-Health, we house leading experts in Pediatrics, Orthopedics, ENT
          (Ear, Nose, and Throat), Dermatology, Physical Therapy, Radiology,
          Oncology, and Neurology. Each department is equipped with
          state-of-the-art technology and staffed with specialists who are at
          the forefront of their respective fields.
        </p>
        <p>
          Whether you're seeking care for your child in Pediatrics,
          rehabilitation in Physical Therapy, or diagnostic imaging in
          Radiology, we strive to deliver personalized treatment plans tailored
          to your specific needs.
        </p>
        <p>
          With a focus on holistic wellness and advanced medical practices,
          E-Health Medical Institute is your trusted partner on your journey to
          optimal health.
        </p>
        <p>
          Experience the difference at E-Health, where your well-being is our
          priority.
        </p>
      </div>
    </div>
  );
};

export default Biography;
