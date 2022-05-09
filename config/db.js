import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();
const { APP_PORT: port, APP_DSN: dsn } = process.env;

const connectDB = async() => {
    await mongoose.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('MongoDB connected');
} 
export default connectDB

