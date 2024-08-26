import { Student } from '../../models/student.model.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import uploadOnCloudinary from '../../helpers/cloudinary.js';
import bcrypt from 'bcrypt';
import { Lecture } from '../../models/lecture.model.js';
import { Course } from '../../models/course.model.js';
import { Enrollment } from '../../models/enrollment.model.js';

const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30
};

const studentRegister = asyncHandler(async (req, res, next) => {
    const { studentPassword, studentFullName, studentUserName, studentPhoneNumber, studentEmail } = req.body;

    if (!studentPassword || !studentUserName || !studentEmail) {
        return res.status(400).json(new ApiError(400, 'Student data is missing'));
    }

    try {
        const user = await Student.findOne({ studentEmail, studentUserName });

        if (user) {
            throw new ApiError(400, 'Student with this email or username already exists');

            // res.status(400)
            // .json(new ApiError(400, 'Student with this email already exists'));
        }

        const encryptedPassword = await bcrypt.hash(studentPassword, 10);

        const savedStudent = await Student.create({
            studentFullName,
            studentPassword: encryptedPassword,
            studentEmail,
            studentUserName,
            studentPhoneNumber
        });

        return res.status(201).json(new ApiResponse(201, 'Student created successfully', savedStudent));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const studentLogin = asyncHandler(async (req, res, next) => {
    const { studentEmail, studentPassword } = req.body;

    if (!studentEmail || !studentPassword) {
        return res.status(400).json(new ApiError(400, 'Student data is missing', req.body));
    }

    try {
        const user = await Student.findOne({ studentEmail: studentEmail }).select('+studentPassword');

        if (!user) {
            return res.json(new ApiError(400, 'Student with this email is not found'));
        }

        const isMatch = await bcrypt.compare(studentPassword, user.studentPassword);

        if (!isMatch) {
            return res.json(new ApiError(401, 'Invalid password for this student'));
        }

        const studentToken = user.generateStudentLogin();

        return res
            .status(200)
            .cookie('studentToken', studentToken, cookieOptions)
            .json(new ApiResponse(200, 'Student login successfully', user));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const studentUpdate = asyncHandler(async (req, res, next) => {
    const { studentEmail } = req.user;

    const { studentFullName, studentAge, studentGender, studentAddress, studentPhoneNumber } = req.body;
    try {
        const user = await Student.findOne({ studentEmail: studentEmail });

        if (studentAge) {
            user.studentAge = studentAge;
        }

        if (studentGender) {
            user.studentGender = studentGender;
        }

        if (studentFullName) {
            user.studentFullName = studentFullName;
        }

        if (studentAddress) {
            user.studentAddress = studentAddress;
        }

        if (studentPhoneNumber) {
            user.studentPhoneNumber = studentPhoneNumber;
        }

        if (req.file) {
            console.log(req.file);
            const uploadedFile = await uploadOnCloudinary(req.file.path);

            user.studentAvatar.public_id = uploadedFile.public_id;
            user.studentAvatar.public_url = uploadedFile.public_url;
        }

        await user.save();

        return res
        .status(200)
        .json(new ApiResponse(200, 'Student updated successfully', user));
    } 
    catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const studentDelete = asyncHandler(async (req, res, next) => {
    const { studentEmail } = req.user;

    try {
        const student = await Student.findOneAndDelete({ studentEmail });

        if (!student) {
            res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(new ApiResponse(200, 'Student deleted successfully', student));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const getStudentProfile = asyncHandler(async (req, res) => {
    const { studentEmail } = req.user;

    try {
        const student = await Student.findOne({ studentEmail });

        return res.json(new ApiResponse(200, 'student profile fetched successfully', student));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(400, error.message));
    }
});

const getMyCourses = asyncHandler(async (req, res, next) => {
    
    const { studentEmail } = req.user;

    try {
        const user = await Student.findOne({ studentEmail });

        if (!user) {
            return res.status(400).json(new ApiError(400, 'Invalid email or password'));
        }

        

        const student = await Enrollment.findOne({studentEmail});

        console.log("Student => ", student);

        const studentCourses = student.studentCourses;

        console.log("studentCourses => ", studentCourses);

        const enrolledCourses = await Course.find({courseCode: {$in: studentCourses}});

        console.log("enrolled Courses => ",enrolledCourses);
        
        
        return res
        .status(200)
        .json(new ApiResponse(200, 'Student courses fetched successfully', enrolledCourses));
        
       
    }   
    catch (error) {
        
        console.log(error);
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const getLecturesByCourse = asyncHandler(async (req, res, next) => {
    const { courseCode } = req.query;

    try {
        const lectures = await Lecture.find({ courseCode });

        return res.status(200).json(new ApiResponse(200, 'Lectures fetched successfully', lectures));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

export {
    studentRegister,
    studentLogin,
    getStudentProfile,
    studentUpdate,
    studentDelete,

    /// course lectures
    getLecturesByCourse,
    getMyCourses
};
