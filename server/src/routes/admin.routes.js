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
} from '../controller/version1/admin.controller.js';
import isAdminLogin from '../middlewares/admin.auth.js';
import { upload } from '../middlewares/multer.middleware.js';

const adminRouter = express.Router();

adminRouter.route('/createAdmin').post(upload.none(), createAdmin);

adminRouter.route('/addTeacher').post(upload.none(), isAdminLogin, addTeacher);

adminRouter.route('/createTeacher').post(isAdminLogin, upload.single('documents'), createTeacher);

adminRouter.route('/totalStudentsEnrolled').post(isAdminLogin, upload.none(), getTotalStudentsEnrolled);

adminRouter.route('/totalTeachers').post(isAdminLogin, upload.none(), getTeachers);
adminRouter.route('/totalCourses').post(isAdminLogin, upload.none(), getCourses);

adminRouter.route('/updateAdmin').post(isAdminLogin, upload.none(), updateAdmin);

adminRouter.route('/getTeachers').get(isAdminLogin, upload.none(), getTeachers);

adminRouter.route('/logout').get(isAdminLogin, upload.none(), logoutAdmin);



adminRouter.route("/getTotalSale").get(
    isAdminLogin,
    upload.none(),
    getTotalSale

)




export default adminRouter;
