import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const isStudentLoggedIn = (req, res, next) => {

    const studentToken = req.cookies.studentToken;

    if(!studentToken) {

        return res.status(401)
        .json(new ApiError(401, 'Student not logged in'))
        .redirect("/login")
    }

    try {

        const decodedToken = jwt.verify(studentToken, process.env.JWT_SECRET);

        if(!decodedToken) {

            return res
            .status(400)
            .redirect("/login")
        }

        req.user = decodedToken;

        const {studentEmail} = req.user;

        if(!studentEmail) {
            return res.status(401)
            .json(new ApiError(401, 'Student not logged in'))
            .redirect("/login")
        }

        next();

    } 

    catch (error) {

        return res.status(401).json({message: 'Invalid token'});
    }
}

export default isStudentLoggedIn;