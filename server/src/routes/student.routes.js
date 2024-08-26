import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { getLecturesByCourse, getMyCourses, getStudentProfile, studentDelete, studentLogin, studentRegister, studentUpdate } from '../controller/version1/student.controller.js';
import isStudentLoggedIn from '../middlewares/student.auth.js';

const studentRouter = express.Router();




studentRouter.route('/register').post(
    upload.none(),
    studentRegister
);



studentRouter.route('/login').post(
    upload.none(),
    studentLogin
)



studentRouter.route('/getProfile').get(
    isStudentLoggedIn,
    getStudentProfile
)


studentRouter.route('/getMyCourses').get(
    isStudentLoggedIn,
    getMyCourses
)



studentRouter.route('/getLecturesByCourse/:courseCode').get(
    isStudentLoggedIn,
    getLecturesByCourse
)





studentRouter.route('/update').put(
    
    isStudentLoggedIn,
    upload.single('studentAvatar'),
    studentUpdate
);


studentRouter.route('/delete').delete(
    
    isStudentLoggedIn,
    upload.none(),
    studentDelete

);


studentRouter.route('/getLecturesByCourse/:courseCode').get(

    
    getLecturesByCourse
)



export default studentRouter;