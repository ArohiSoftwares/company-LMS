import express from 'express';

const courseRouter = express.Router();

import { createCourse, deleteCourse, getCourseByCode, getCourses, sendSignedUrl, updateCourse, uploadLectures } from '../controller/version1/course.controller.js';
import isAdminLogin from '../middlewares/admin.auth.js';
import { upload } from '../middlewares/multer.middleware.js';
import isTeacherLogin from '../middlewares/teacher.auth.js'
import { lectureUpload, thumbnailUpload } from '../middlewares/lecture.middleware.js';
import { showAllCourses } from '../controller/version1/admin.controller.js';





courseRouter.route('/createCourse').post(

    isAdminLogin,
    upload.single('courseThumbnail'),
    createCourse
)




courseRouter.route('/updateCourse').post(
    upload.none(),
    updateCourse
)


courseRouter.route('/deleteCourse').post(
    
    isAdminLogin,
    upload.none(),
    deleteCourse
)

courseRouter.route('/getCourses').get(
    
    isAdminLogin,
    upload.none(),
    getCourses
)


courseRouter.route('/getCourseByCode').get(
    
    
    upload.none(),
    getCourseByCode
)


courseRouter.route('/getCourseByCode/:courseCode').get(
    
    upload.none(),
    getCourseByCode
)





courseRouter.route('/showAllCourses').get(
    showAllCourses
)






// courseRouter.route(`/uploadLectures`).post(
    
//     isTeacherLogin,
//     upload.single('lecture'),
//     uploadLectures
    
// )

courseRouter.route(`/uploadLectures`).post(
    isTeacherLogin,
    sendSignedUrl
)



export default courseRouter;