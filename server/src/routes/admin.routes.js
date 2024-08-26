import express from 'express';
import { Admin } from '../models/admin.model.js';
import { createAdmin, createTeacher,getCourses, getTeachers, logoutAdmin,getTotalStudentsEnrolled, updateAdmin } from '../controller/version1/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import isAdminLogin from '../middlewares/admin.auth.js';
import { createCourse } from '../controller/version1/course.controller.js';

const adminRouter = express.Router();





adminRouter.route('/createAdmin').post(

    upload.none(),
    createAdmin
)


adminRouter.route('/createTeacher').post(
    isAdminLogin,
    upload.single('documents'),
    createTeacher
)

adminRouter.route('/totalStudentsEnrolled').post(
    isAdminLogin,
    upload.none(),
    getTotalStudentsEnrolled
)

adminRouter.route('/totalTeachers').post(
    isAdminLogin,
    upload.none(),
    getTeachers
)
adminRouter.route('/totalCourses').post(
    isAdminLogin,
    upload.none(),
    getCourses
)



adminRouter.route('/updateAdmin').post(

    isAdminLogin,
    upload.none(),
    updateAdmin

)



adminRouter.route('/getTeachers').get(

    isAdminLogin,
    upload.none(),
    getTeachers

)





adminRouter.route('/logout').get(

    isAdminLogin,
    upload.none(),
    logoutAdmin
)





export default adminRouter;
