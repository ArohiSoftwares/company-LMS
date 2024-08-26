import { Router } from 'express';
import { loginUser, forgetPassword, resetPassword } from '../controller/version1/login.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const loginRouter = Router();

loginRouter.route('/login').post(upload.none(), loginUser);

loginRouter.route('/forgetpassword').post(upload.none(), forgetPassword);

loginRouter.route('/resetpassword').post(upload.none(), resetPassword);

export default loginRouter;
