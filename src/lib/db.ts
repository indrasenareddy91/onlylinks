import mongoose from "mongoose";

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`Successfully connected to mongoDB 🥂`);
    return mongoose;
  } catch (error: unknown) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

export default connectDB;