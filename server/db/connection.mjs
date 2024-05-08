import mongoose from "mongoose";

const ATLAS_URI = 'mongodb+srv://TGAdmin:TGPassparola@trengodb.u9myqjj.mongodb.net/TrenGo?retryWrites=true&w=majority&appName=TrenGoDB';


async function connectToMongoDB() {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToMongoDB;