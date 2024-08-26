import mongoose from 'mongoose';


const connectDB = async () => {

    try {
        
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connection established successfully with ${connection.connection.host}`);
    } 
    
    catch (err) {
        console.log('Error connecting to MongoDB', err);
        process.exit(1);
    }
};


export default connectDB;