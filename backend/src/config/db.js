import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MONGODB CONNECTED SUCCESSFULLY\n");
        })

        await mongoose.connect(process.env.MONGODB_URI);


    } catch (error) {
        console.error("Error connecting to MONGODB\n", error);
        process.exit(1); // exit with failure
    }
}

export default connectDB;