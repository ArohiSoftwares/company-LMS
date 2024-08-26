import { paymentInstance } from '../../../index.js';
import { Course } from '../../models/course.model.js';
import { Payment } from '../../models/payment.model.js';
import { Student } from '../../models/student.model.js';
import ApiError from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import crypto from 'crypto';
import { clientUrl } from '../../../app.js';
import { Enrollment } from '../../models/enrollment.model.js';
import { log } from 'console';

const createPaymentForCourse = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json(new ApiError(400, 'Amount is required'));
    }

    try {
        const order = await paymentInstance.orders.create({
            amount,
            currency: 'INR'
        });

        console.log(order);

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Payment initiated successfully',
            order
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const verifyPaymentForCourse = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(req.body);

    const { studentEmail } = req.user;
    const { courseCode } = req.params || req.query;

    console.log('req.user => ', req.user);

    console.log('req.query', req.query);
    console.log('req.params', req.params);

    try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const verified = expectedSignature === razorpay_signature;

        if (!verified) {
            return res.status(400).json(new ApiError(400, 'Signature is not verified your session is expired'));
        }

        console.log('after verification of payement => ', verified);

        const student = await Student.findOne({ studentEmail });

        if (!student) {
            return res.status(400).json(new ApiError(400, 'Student not found'));
        }

        console.log('after verification of student => ', student);

        const checkCourse = await Course.findOne({ courseCode: courseCode });

        if (!checkCourse) {
            return res.status(400).json(new ApiError(400, 'Course not found'));
        }

        console.log('after verification of course => ', checkCourse);

        const enrolled = await Enrollment.findOne({ studentEmail });

        if (enrolled) {
            enrolled.studentCourses.push(checkCourse.courseCode);
            await enrolled.save();
        } else {
            const enroll = await Enrollment.create({
                studentEmail,
                studentCourses: [courseCode]
            });

            console.log('enroll => ', enroll);
            await enroll.save();
        }

        console.log('enrolled => ', enrolled);

        const payment = await Payment.create({
            studentEmail: studentEmail,
            courseCode,
            razorpay_order_id,
            razorpay_payment_id,
            transactionDate: Date.now(),
            razorpay_signature,
            status: 'paid'
        });

        console.log(payment);

        return res.status(200).redirect(`http://localhost:3000`);
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const getUserPaymentbyCourseCode = asyncHandler(async (req, res) => {
    const { courseCode } = req.body;
    console.log(`Querying for courseCode: ${courseCode.courseCode}`);

    try {
        const getPayment = await Payment.find({ courseCode: courseCode.courseCode, status: 'paid' }).populate(
            'courseCode'
        ); // Assuming courseCode is a reference


        if (getPayment.length === 0) {
            return res.status(200).json(new ApiResponse(200, 'No payments found'));
        }

        return res.status(200).json(getPayment);
    } catch (err) {
        console.log('Get user Payment error ', err);
        return res.status(500).json(new ApiError(500, err.message));
    }
});

export { createPaymentForCourse, verifyPaymentForCourse, getUserPaymentbyCourseCode };
