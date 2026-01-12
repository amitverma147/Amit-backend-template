import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB Connected:", mongoose.connection.host);
};

export default connectDB;
