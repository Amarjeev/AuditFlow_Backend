import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const mongoUri: string = process.env.MONGO_URL || "";
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;
