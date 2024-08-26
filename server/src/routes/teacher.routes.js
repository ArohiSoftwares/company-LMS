import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';

import {
    getTeacherCourses,
    getTeacherProfile,
    teacherDelete,
    teacherUpdate,
    uploadAadhar,
    uploadPan
} from '../controller/version1/teacher.controller.js';

import isTeacherLogin from '../middlewares/teacher.auth.js';

const teacherRouter = express.Router();

teacherRouter.route('/update').put(isTeacherLogin, upload.none(), teacherUpdate);

teacherRouter.route('/getMyCourses').get(isTeacherLogin, getTeacherCourses);

teacherRouter.route('/getProfile').get(isTeacherLogin, getTeacherProfile);

teacherRouter.route('/delete').post(teacherDelete);

teacherRouter.route('/aadhar').post(isTeacherLogin, upload.single('aadhar'), uploadAadhar);
teacherRouter.route('/pan').post(isTeacherLogin, upload.single('pan'), uploadPan);

export default teacherRouter;
