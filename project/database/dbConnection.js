import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/Hospital_Management", {
    
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  };