import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './src/database/db.js';

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 5000;





import Razorpay from 'razorpay';
export const paymentInstance = new Razorpay({
    
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    
})















connectDB()

.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})

.catch((err) => {
    console.log('Error connecting to Express server', err);
    process.exit(1);
});

