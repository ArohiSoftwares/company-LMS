import express from 'express';
import healthController from './src/controller/health.controller.js';
import morgan from 'morgan';
import allRouter from './router/router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import ApiResponse from './src/utils/apiResponse.js';


const app = express();  /// create express app

export const clientUrl = "http://localhost:3000";


app.use(express.json());
app.use(express.urlencoded({extended: true}));  /// accept form data
app.use(morgan('dev'));

app.use(cookieParser())
app.use(
cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
})
)

app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*") // watch it
res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
);
next()
})




app.get('/api/getkey', (req, res) => {

    res
    .json(
        {key : process.env.RAZORPAY_KEY_ID}
    );
})
 


app.use("/api", allRouter);

app.get('/health', healthController);

app.use("*", (req, res) => {
    res.status(404).send("Not found this page in backend server");
});

export default app;