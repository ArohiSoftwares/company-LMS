import { Admin } from '../../models/admin.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import { Teacher } from '../../models/teacher.model.js';
import { Student } from '../../models/student.model.js';
import { Course } from '../../models/course.model.js';
import { documentUpload } from '../../helpers/lecture.cloudinary.js';

const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: true
};

const createAdmin = asyncHandler(async (req, res) => {
    try {
        const { studentEmail, studentPassword } = req.body;
        console.log(studentEmail, studentPassword);

        if (!studentEmail || !studentPassword) {
            return res.json(new ApiError(400, 'Please provide student email and password'));
        }

        const user = await Student.findOne({ studentEmail }).select('+studentPassword').populate('studentCourses');
        console.log(user);
        if (!user) {
            return res.json(new ApiError(400, 'Student with this email is not exist'));
        }

        const comparePassword = await bcrypt.compare(studentPassword, user.studentPassword);

        if (!comparePassword) {
            return new ApiError(400, 'Invalid password for this student');
        }

        const verifyTeacher = await Teacher.findOne({ teacherEmail: studentEmail });

        if (verifyTeacher) {
            return res.json(new ApiResponse(400, "teacher already created by this email you can't create admin "));
        }

        const verifyAdmin = await Admin.findOne({ adminEmail: studentEmail });

        if (verifyAdmin) {
            return res.json(new ApiResponse(400, 'admin already created by you '));
        }

        /// create a entry in admin collection
        console.log(user);
        const admin = await Admin.create({
            adminName: user.studentName,
            adminUserName: user.studentUserName,
            adminEmail: user.studentEmail,
            adminPhoneNumber: user.studentPhoneNumber,
            adminUserName: user.studentUserName,
            adminPassword: user.studentPassword,
            isActive: true
        });

        /// delete a entry in the student collection
        const deleteStudent = await Student.findByIdAndDelete(user._id);

        return res.status(200).json(new ApiResponse(200, 'Admin create successfully', admin, deleteStudent));
    } catch (error) {
        console.log('error => ', error);

        return res.status(400).json(new ApiError(400, error.message));
    }
});

const getTotalStudentsEnrolled = asyncHandler(async (req, res) => {
    const { adminEmail } = req.user;
    if (!adminEmail) return res.status(400).json(new ApiError(400, 'Not authorized to access'));
    try {
        const students = await Student.find();
        return res.status(200).json(new ApiResponse(200, 'Total students enrolled', students));
    } catch (err) {
        console.log(err);
        return res.status(400).json(new ApiError(400, err.message));
    }
});

const createTeacher = asyncHandler(async (req, res) => {
    try {
        const { studentEmail, studentPassword, subjects, yof, qualifications, bio } = req.body;

        const { adminEmail } = req.user;

        if (!studentEmail || !studentPassword) {
            return res.json(new ApiError(400, 'Please provide student email and password'));
        }

        // check if student email in collection
        const user = await Student.findOne({ studentEmail }).select('+studentPassword');
        
        if (!user) {
            return res.json(new ApiError(400, 'Student with this email is not exist'));
        }

        const comparePassword = await bcrypt.compare(studentPassword, user.studentPassword);

        if (!comparePassword) {
            return res.json(new ApiError(400, 'Invalid password for this student'));
        }

        const verifyAdmin = await Admin.findOne({ adminEmail: studentEmail });

        if (verifyAdmin) {
            return res.json(new ApiResponse(400, "admin already created by this email you can't create teacher "));
        }

        const verifyTeacher = await Teacher.findOne({ adminEmail: studentEmail });

        if (verifyTeacher) {
            return res.json(new ApiResponse(400, "teacher already created by this email you can't create teacher "));
        }
        
        // const uploadDoc = await documentUpload(req.file.path);

        /// create a entry in admin collection
        console.log(res);
        const teacher = await Teacher.create({
            teacherName: user.studentName,
            teacherUserName: user.studentUserName,
            teacherFullName: user.studentFullName,
            teacherEmail: user.studentEmail,
            teacherPhoneNumber: user.studentPhoneNumber,
            adminEmail,
            teacherPassword: user.studentPassword,
            isActive: true,
            teacherSubjects: subjects,
            teacherQualifications: qualifications,
            teacherYearOfExperience: yof,
            teacherbio: bio,
            teacherCourseCode: []
            
        });



        /// delete a entry in the student collection
        const deleteStudent = await Student.findByIdAndDelete(user._id);

        return res.status(200).json(new ApiResponse(200, 'Teacher create successfully', teacher));
    } catch (error) {
        console.log('error => ', error);

        return res.status(400).json(new ApiError(400, error.message));
    }
});

const updateAdmin = asyncHandler(async (req, res) => {
    const { adminEmail } = req.user;

    const { adminName, adminPhoneNumber } = req.body;

    try {
        const user = await Admin.findOne({ adminEmail });

        if (adminName) {
            user.adminName = adminName;
        }

        if (adminPhoneNumber) {
            user.adminPhoneNumber = adminPhoneNumber;
        }

        if (req.file) {
            const uploadedFile = await uploadOnCloudinary(req.file.path);

            user.adminAvatar.public_id = uploadedFile.public_id;
            user.adminAvatar.public_url = uploadedFile.public_url;
        }

        await user.save();

        return res.status(200).json(new ApiResponse(200, 'Admin updated successfully', user));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const adminToken = req.cookies?.adminToken;

    console.log('admin token => ', adminToken);

    try {
        if (!adminToken) {
            return res.status(400).json(new ApiError(400, 'Admin token not found'));
        }

        return res
            .status(200)
            .cookie('adminToken', null, cookieOptions)
            .json(new ApiResponse(200, 'Admin logout successfully'));
    } catch (error) {
        console.log(error);
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const getAllStudents = asyncHandler(async (req, res) => {
    const { adminEmail } = req.user;

    try {
        const course = await courseModel;
    } catch (error) {
        console.log(error);
        return res.status(400).json(new ApiError(400, error.message));
    }
});

const showAllCourses = asyncHandler(async (req, res) => {
    try {
        const course = await Course.find({});

        

        return res.status(200).json(new ApiResponse(200, 'Courses fetched successfully', course));
    } catch (error) {
        console.log(error);
    }
});

const getTeachers = async (req, res) => {
    const { adminEmail } = req.user;

    try {
        const teachers = await Teacher.find();

        return res.status(200).json(new ApiResponse(200, 'Teachers fetched successfully', teachers));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
};

const getCourses = async (req, res) => {
    const { adminEmail } = req.user;

    try {
        const courses = await Course.find({ adminEmail });

        return res.status(200).json(new ApiResponse(200, 'Courses fetched successfully', courses));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
};

export {
    createAdmin, /// create admin
    createTeacher, //// create teacher
    updateAdmin,
    logoutAdmin,
    getTeachers,
    showAllCourses,
    getTotalStudentsEnrolled,
    getCourses
};
