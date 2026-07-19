import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoURI, { dbName: 'pantrypilot' });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    throw err; // process.exit(1) সরিয়ে দিলাম — serverless-এ এটা চলবে না
  }
};

export default connectDB;