import mongoose from "mongoose";

// MongoDB connection URL
const DB_URL =
  "mongodb+srv://riddhimehta2702:riddhimehta2702@locality.epfbkmi.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
