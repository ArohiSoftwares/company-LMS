import express from 'express';

import {
    addTeacher,
    createAdmin,
    createTeacher,
    getCourses,
    getTeachers,
    getTotalSale,
    getTotalStudentsEnrolled,
    logoutAdmin,
    updateAdmin,
    getUser,
    deleteTeacher,
    updateTeacher
} from '../controller/version1/admin.controller.js';
import isAdminLogin from '../middlewares/admin.auth.js';
import { upload } from '../middlewares/multer.middleware.js';

const adminRouter = express.Router();

adminRouter.route('/createAdmin').post(upload.none(), createAdmin);

adminRouter.route('/user').get(isAdminLogin,upload.none(),getUser)
adminRouter.route('/addTeacher').post(upload.none(), isAdminLogin, addTeacher);

adminRouter.route('/createTeacher').post(isAdminLogin, upload.single('teacherProfileUrl'), createTeacher);

adminRouter.route('/totalStudentsEnrolled').post(isAdminLogin, upload.none(), getTotalStudentsEnrolled);

adminRouter.route('/totalTeachers').post(isAdminLogin, upload.none(), getTeachers);
adminRouter.route('/totalCourses').post(isAdminLogin, upload.none(), getCourses);

adminRouter.route('/updateAdmin').post(isAdminLogin, upload.none(), updateAdmin);

adminRouter.route('/getTeachers').get( upload.none(), getTeachers);
adminRouter.route('/updateTeacher').post(isAdminLogin, upload.none(), updateTeacher);
adminRouter.route('/deleteTeacher').post(isAdminLogin, upload.none(), deleteTeacher);

adminRouter.route('/logout').get(isAdminLogin, upload.none(), logoutAdmin);



adminRouter.route("/getTotalSale").get(
    isAdminLogin,
    upload.none(),
    getTotalSale

)




export default adminRouter;
