import mongoose from "mongoose";

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToMongoDB;