import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import bcrypt from 'bcrypt';

import { Student, Teacher, Admin } from '../../models/export/export.model.js';
import { ForgetPasswordToken } from '../../models/reset.model.js';
import crypto from 'crypto';
const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
};

const loginUser = asyncHandler(async (req, res) => {
    const { studentEmail, studentPassword } = req.body;

    console.log('req.body => ', req.body);

    if (!studentEmail || !studentPassword) {
        return res.status(400).json(new ApiError(400, 'Email and Password are required'));
    }

    try {
        /// find this is student or not

        const student = await Student.findOne({ studentEmail }).select('+studentPassword');

        console.log(student);
        if (student) {
            const comparePassword = await bcrypt.compare(studentPassword, student.studentPassword);
            console.log(comparePassword);
            if (!comparePassword) {
                return res.status(400).json(new ApiError(400, 'Email or Password is incorrect in Students'));
            }

            const studentToken = student.generateStudentLogin();
            console.log('studentToken => ', studentToken);

            return (
                res
                    .status(200)
                    .cookie('studentToken', studentToken, cookieOptions)
                    // .redirect('/studentDashboard')
                    .json(new ApiResponse(201, 'Student login successfully', student))
            );
        }

        /// find this teacher or not

        const teacher = await Teacher.findOne({ teacherEmail: studentEmail }).select('+teacherPassword');

        if (teacher) {
            const comparePassword = await bcrypt.compare(studentPassword, teacher.teacherPassword);

            if (!comparePassword) {
                return res.status(400).json(new ApiError(400, 'Email or Password is incorrect to find in Teachers'));
            }

            const teacherToken = teacher.generateTeacherLogin();
            console.log('teacherToken => ', teacherToken);

            return res
                .status(200)
                .cookie('teacherToken', teacherToken, cookieOptions)
                .json(new ApiResponse(200, 'Teacher login successfully', teacher, teacherToken));
        }

        const admin = await Admin.findOne({ adminEmail: studentEmail }).select('+adminPassword');

        if (admin) {
            const comparePassword = await bcrypt.compare(studentPassword, admin.adminPassword);

            if (!comparePassword) {
                return res.status(400).json(new ApiError(400, 'Email or Password is incorrect to find in Admins'));
            }

            const adminToken = admin.generateAdminLogin();

            return res
                .status(200)
                .cookie('adminToken', adminToken, cookieOptions)
                .json(new ApiResponse(200, 'Admin login successfully', admin));
        }

        return res.json(new ApiResponse(404, 'Email or Password is incorrect to find in All Servers'));
    } catch (error) {
        console.log('error => ', error);
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(email);
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'your_email@example.com',
            pass: 'your_password'
        }
    });
    try {
        // Generate a unique reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;

        const reset = await ForgetPasswordToken.create({
            email: email,
            token: resetToken
        });

        try {
            let info = await transporter.sendMail({
                from: 'LMS Reset Password',
                to: email,
                subject: 'Password Reset Request',
                text: `Please use the following link to reset your password: ${resetLink}`,
                html: `<p>Please use the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
            });

            console.log('Password reset email sent: %s', info.messageId);
            res.json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ error: 'Failed to send password reset email' });
        }
    } catch (err) {
        console.log('Error ', err);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    // Verify the token
    const getToken = await ForgetPasswordToken.find({ token: token });
    if (getToken) {
        const email = getToken.email;

        // Here you would update the user's password in your database
        console.log(`Updating password for ${email}`);
        const user = Student.updateOne(
            { email: email },
            {
                studentPassword: newPassword
            }
        );

        const removeTokenFromDB = ForgetPasswordToken.deleteOne({ email: email });

        res.json({ message: 'Password successfully reset' });
    } else {
        res.status(400).json({ error: 'Invalid or expired reset token' });
    }
});

export { loginUser, forgetPassword, resetPassword };
