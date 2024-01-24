import mongoose from "mongoose";

const attemptConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB");
  } catch (err: any) {
    console.error("Error connecting to MongoDB: ", err.message);
    process.exit(1);
  }
};

export default attemptConnection;
