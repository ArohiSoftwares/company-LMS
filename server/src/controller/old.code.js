
const registerAdmin = asyncHandler(async (req, res) => {

    
    const {adminName, adminEmail, adminPhoneNumber, adminPassword} = req.body;

    if(!(adminName, adminEmail, adminPhoneNumber, adminPassword )) {

        return res
        .status(400)
        .json(new ApiResponse(405, 'Please provide all the required fields'));
    }

    try {
        const user = await Admin.findOne({adminEmail});
    
        if(user) {
            return res
            .status(400)
            .json(new ApiError(405, 'Admin with this email already exists'));
        }
    
        const encryptedPassword = await bcrypt.hash(adminPassword, 10);
    
        const savedAdmin = await Admin.create({
            adminName,
            adminEmail,
            adminPhoneNumber,
            adminPassword: encryptedPassword,
            isActive: true,
        });
    
        return res
            .status(201)
            .json(new ApiResponse(201, 'Admin created successfully', savedAdmin));
    
    } 
    catch (error) {
        
        console.log(error);
        return res
        .status(400)
        .json(new ApiError(400, error.message));
        
    }

});


const loginAdmin = asyncHandler(async (req, res) => {

    console.log();
    const {adminEmail, adminPassword} = req.body;

    if(!adminEmail || !adminPassword) {
        return res
        .status(400)
        .json(new ApiError(400, 'Admin data is missing', req.body));
    }

    try {
    
        const user = await Admin.findOne({adminEmail}).select('+adminPassword');

        if(!user) {
            return new ApiError(400, 'Admin with this email already exists');
        }

        const isMatch = await bcrypt.compare(adminPassword, user.adminPassword);

        if (!isMatch) {
            return new ApiError(401, 'Invalid password for this admin');
        }

        const adminToken = user.generateAdminLogin();

        console.log("admin token => ", adminToken);

        return res
        .status(200)
        .cookie("adminToken", adminToken, cookieOptions)
        .json(new ApiResponse(200, 'Admin login successfully', user));

        
    } 
    catch (error) {
        
        console.log(error);
        return res
        .status(400)
        .json(new ApiError(400, error.message));
    }

});




adminRouter.route('/register').post(

    upload.none(),
    registerAdmin,
)

adminRouter.route('/login').post(

    upload.none(),
    loginAdmin
)
















const studentRegister = asyncHandler(async (req, res, next) => {

    const {studentFullName, studentPassword, studentPhoneNumber, studentAge, studentGender, studentEmail,} = req.body;

    if(!req.body) {
        throw new ApiError(400, 'Student data is missing');
    }

    if(!studentFullName || !studentPhoneNumber || !studentAge || !studentGender || !studentEmail) {


        return res
        .status(400)
        .json(new ApiError(400, 'Student data is missing'));
        
    }


    try {

        const user = await Student.findOne({studentEmail: studentEmail});

        if(user) {

            throw new ApiError(400, 'Student with this email already exists');
    
            // res.status(400)
            // .json(new ApiError(400, 'Student with this email already exists'));
        }


        const encryptedPassword = await bcrypt.hash(studentPassword, 10);


        const savedStudent = await Student.create({
            studentFullName,
            studentPhoneNumber,
            studentAge,
            studentPassword: encryptedPassword,
            studentGender,
            studentEmail,
        });
        


        return res
        .status(201)
        .json( new ApiResponse(201, 'Student created successfully', savedStudent));


    } 
    
    catch (error) {
        
        return res
        .status(400)
        .json(new ApiError(400, error.message));
    }
    
});


const studentLogin = asyncHandler(async (req, res, next) => {

    const {studentEmail, studentPassword} = req.body;

    if(!studentEmail || !studentPassword) {

        return res
        .status(400)
        .json(new ApiError(400, 'Student data is missing', req.body));
    }

    try {
    
        const user = await Student.findOne({studentEmail: studentEmail});


        if(!user) {

            return new ApiError(400, 'Student with this email already exists');
        }

        const isMatch = await bcrypt.compare(studentPassword, user.studentPassword);

        if (!isMatch) {
            return new ApiError(401, 'Invalid password for this student');
        }

        const studentToken = user.generateStudentLogin();


        return res
        .status(200)
        .cookie('studentToken', studentToken, cookieOptions)
        .json(new ApiResponse(200, 'Student login successfully', user));

        
    } 
    catch (error) {
        
        return res
        .status(400)
        .json(new ApiError(400, error.message));
    }

});







studentRouter.route('/register').post(
    upload.none(),
    studentRegister
);


studentRouter.route('/login').post(
    
    upload.none(),
    studentLogin

);













const teacherRegister = asyncHandler(async (req, res) => {

    const {teacherFullName, teacherAge, teacherGender, teacherEmail, teacherPassword, teacherPhoneNumber, teacherSubjects} = req.body;

    console.log(req.body);
    try {

        if(!teacherFullName || !teacherAge || !teacherGender || !teacherEmail || !teacherPassword || !teacherPhoneNumber || !teacherSubjects) {

            return res
            .status(400)
            .json(new ApiError(400, 'Missing required fields'));
        }

        console.log("After checking");
    
        // const user = await Teacher.findOne({teacherEmail});
    
        // if(user) {
        //     return res
        //     .status(400)
        //     .json(new ApiError(400, 'Email already exists'));
        // }
    
        console.log("After User check");

        const hashedPassword = await bcrypt.hash(teacherPassword, 10);
    
        const newUser = new Teacher({
            teacherFullName,
            teacherAge,
            teacherGender,
            teacherEmail,
            teacherPassword: hashedPassword,
            teacherPhoneNumber,
            teacherSubjects,
        });
    
        await newUser.save();
    
        return res
        .status(200)
        .json(new ApiResponse(200, 'Teacher registered successfully', newUser));
    
       
    } 
    
    catch (error) {

        console.log(error);
        
        return res 
        .status(500)
        .json(new ApiError(500, error.message));
    }
});


const teacherLogin = asyncHandler(async (req, res) => {

    const {teacherEmail, teacherPassword} = req.body;

    if(!teacherEmail || !teacherPassword) {

        return res
        .status(400)
        .json(new ApiError(400, 'Missing required fields'));
    }

    try {
        const user = await Teacher.findOne({teacherEmail});

        if(!user) {
            return res
            .status(400)
            .json(new ApiError(400, 'Invalid email or password'));
        }

        const isValidPassword = await bcrypt.compare(teacherPassword, user.teacherPassword);

        if(!isValidPassword) {
            return res
            .status(400)
            .json(new ApiError(400, 'Invalid email or password'));
        }

        const teacherToken = await user.generateTeacherLogin();

        return res
        .status(200)
        .cookie('teacherToken', teacherToken, cookieOptions)
        .json(new ApiResponse(200, 'Teacher logged in successfully', user));

       
    }   

    catch (error) {
        
        return res 
        .status(500)
        .json(new ApiError(500, error.message));
    }

});





teacherRouter.route('/registerTeacher').post(
    upload.none(),
    teacherRegister
);

teacherRouter.route('/login').post(
    
    upload.none(),
    teacherLogin
);


