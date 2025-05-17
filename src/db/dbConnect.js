import mongoose from "mongoose";

const connection = {};

export default async function connectDB() {
  if (connection.isConnected) {
    console.log("Already connected to db");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to db");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("Failed to connect to db", error);
    process.exit(1);
  }
}
