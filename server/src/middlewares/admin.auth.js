import JWT from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/apiResponse.js';

const isAdminLogin = (req, res, next) => {

    try {

        console.log("frontend cookies => ",req.cookies); 

        // console.log("frontend headers => ",req.header("Authorization"));

        // const adminToken = req.cookies?.adminToken || req.header("Authorization")?.replace("Bearer ", "")


        const adminToken = req.cookies ? req.cookies.adminToken : req.header("Authorization")?.replace("Bearer ");



        if(!adminToken) {
            return res
            .status(401)
            .json(new ApiResponse(401, 'Unauthorized token user not found'));
        }

        
        const decoded = JWT.decode(adminToken, process.env.JWT_SECRET);

        // const decoded = JWT.verify(adminToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } 
    catch (error) {
        console.log(error);
        return res
        .status(401)
        .json(new ApiError(401, error.message));
    }    
}

export default isAdminLogin;