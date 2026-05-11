import mongoose, { connect } from "mongoose";


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MONGODB Connection Error" ,error);
        process.exit(1);
    }
}

export default connectDb;