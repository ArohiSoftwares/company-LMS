import express from 'express';

import {
  createPaymentForCourse,
  getUserPaymentbyCourseCode,
  verifyPaymentForCourse,
} from '../controller/version1/payment.controller.js';
import isAdminLogin from '../middlewares/admin.auth.js';
import isStudentLoggedIn from '../middlewares/student.auth.js';

const paymentRouter = express.Router();

paymentRouter.route('/createPaymentForCourse').post(isStudentLoggedIn, createPaymentForCourse);

paymentRouter.route(`/verifyPaymentForCourse/:courseCode/:amount`).post(isStudentLoggedIn, verifyPaymentForCourse);

paymentRouter.route('/admin/getpaymentdetails').post(isAdminLogin, getUserPaymentbyCourseCode);

export default paymentRouter;
