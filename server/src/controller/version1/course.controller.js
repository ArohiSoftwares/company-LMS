import { Course } from '../../models/course.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import ApiError from '../../utils/ApiError.js';
import { Lecture } from '../../models/lecture.model.js';
import { lectureUploadOnCloudinary, thumbnailUploadOnCloudinary } from '../../helpers/lecture.cloudinary.js';
import { Admin } from '../../models/admin.model.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { stderr, stdout } from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dontenv from 'dotenv';
import { Teacher } from '../../models/teacher.model.js';
dontenv.config();

const client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    }
});

/// create a course

const createCourse = asyncHandler(async (req, res) => {
    const { adminEmail } = req.user;

    console.log('req.user => ', req.user);

    const {
        courseName,
        courseThumbnail,
        courseDescription,
        coursePrice,
        courseCode,
        courseTeacher,
        courseEndDate,
        courseStartDate,
        courseDuration,
        courseTools,
        courseTechnology
    } = req.body;

    // const { courseName, courseDescription, coursePrice, courseCode,courseTeacher,courseEndDate, courseStartDate, courseDuration } = req.body;

    // if(!courseName || !courseDescription || !coursePrice || !courseCode || !courseTeacher || !courseStartDate ||!courseEndDate|| !courseDuration) {

    //     return res
    //     .status(400)
    //     .json(new ApiError(405, 'Missing required fields'));
    // }

    console.log('req.file => ', req.file);

    const admin = await Admin.findOne({ adminEmail });

    if (!admin) {
        return res.status(404).json(new ApiError(404, 'Admin not found'));
    }

    console.log('req.file => ', req.file);

    console.log(req.body);
    try {
        const corName = await Course.findOne({ courseCode });

        if (corName) {
            return res.status(400).json(new ApiError(405, 'Course name already exists'));
        }

        const path = req.file.path;
        console.log('path -> ', path);
        const response = await thumbnailUploadOnCloudinary(path);

        // if(!response) {
        //     return res
        //     .status(400)
        //     .json(new ApiError(405, 'Thumbnail not uploaded', response));
        // }

        const course = await Course.create({
            courseName,
            courseDescription,
            coursePrice,
            courseCode,
            courseStartDate,
            courseEndDate,
            courseTools,
            courseTechnology,
            adminEmail: adminEmail,

            adminEmail,

            courseDuration,
            courseTeacher: [ courseTeacher ],

            courseThumbnail: {
                public_id: response.public_id,
                private_url: response.secure_url
            }
        });


        // const teacher = await Teacher.findOne({ teacherEmail: courseTeacher });

        // teacher.teacherCourseCode.push(courseCode);





        console.log('After course', course);

        return res.status(201).json(new ApiResponse(201, 'Course created successfully', course));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const updateCourse = asyncHandler(async (req, res) => {
    const {
        courseName,
        courseDescription,
        coursePrice,
        courseSubject,
        courseTeacher,
        courseStartDate,
        courseDuration,
        courseCode,
        courseEndDate
    } = req.body;

    console.log('req.body => ', req.body);

    try {
        const course = await Course.findOne({ courseName, courseCode });

        if (!course) {
            return res.status(404).json(new ApiError(404, 'Course not found'));
        }

        console.log('course after findById => ', course);

        if (courseDescription) {
            course.courseDescription = courseDescription;
        }

        if (coursePrice) {
            course.coursePrice = coursePrice;
        }

        if (courseSubject) {
            course.courseSubject = courseSubject;
        }

        if (courseTeacher) {
            course.courseTeacher = courseTeacher;
        }

        if (courseStartDate) {
            course.courseStartDate = courseStartDate;
        }
        if (courseEndDate) {
            course.courseEndDate = courseEndDate;
        }

        if (courseDuration) {
            course.courseDuration = courseDuration;
        }

        await course.save();

        console.log('course after save => ', course);
        return res.status(200).json(new ApiResponse(200, 'Course updated successfully', course));
    } catch (error) {
        console.log('error => ', error);
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const getCourses = asyncHandler(async (req, res) => {
    try {
        const { adminEmail } = req.user;

        const admin = await Admin.findOne({ adminEmail });

        if (!admin) {
            return res.status(404).json(new ApiError(404, 'Admin not found'));
        }

        const courses = await Course.find({ adminEmail });

        return res.status(200).json(new ApiResponse(200, 'Courses retrieved successfully', courses));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const getCourseByCode = asyncHandler(async (req, res) => {
    const { courseCode } = req.query || req.params;

    // const { courseCode } = req.params;
    console.log('Coure Code', courseCode);
    if (!courseCode) {
        return res.status(400).json(new ApiError(405, 'Missing required fields'));
    }

    try {
        const course = await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json(new ApiError(404, 'Course not found'));
        }

        return res.status(200).json(new ApiResponse(200, 'Course retrieved successfully', course));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json(new ApiError(405, 'Missing required fields'));
    }

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json(new ApiError(404, 'Course not found'));
        }

        await course.deleteOne();

        return res.status(200).json(new ApiResponse(200, 'Course deleted successfully', course));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const uploadLectures = asyncHandler(async (req, res) => {
    const videoSegmentsPath = [];
    let fullvideopath = '';
    const courseCode = 'AIDS';
    console.log(courseCode);
    const { teacherEmail } = req.user;
    const { lectureName, lectureDescription } = req.body;

    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/lectures/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log('hlsPath', hlsPath);
    console.log('video Paht => ', videoPath);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
        console.log(outputPath);
    }

    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(
        ffmpegCommand,
        async (error, stdout, stderr) => {
            if (error) {
                console.log(`exec error: ${error}`);
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            const videoUrl = `http://localhost:5000/uploads/courses/${lessonId}/index.m3u8`;
            fullvideopath = videoUrl;

            const directoryPath = path.join(outputPath);
            console.log(outputPath);

            fs.readdir(directoryPath, function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                //listing all files using forEach
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    videoSegmentsPath.push(`${outputPath}/${file}`);
                    console.log(file);
                });
            });

            await lectureUploadOnCloudinary(videoSegmentsPath);
            res.json({
                message: 'Video converted to HLS format',
                videoUrl: fullvideopath,
                lessonId: lessonId
            });
        },
        async () => {}
    );

    if (!lectureName || !lectureDescription || !courseCode || !teacherEmail) {
        return res.status(400).json(new ApiError(405, 'Missing required fields'));
    }

    console.log('req.body => ', req.body);

    console.log('req.query => ', req.query);
    console.log('req.user => ', req.user);

    if (!courseCode) {
        return res.status(400).json(new ApiError(405, 'Missing required fields'));
    }

    try {
        const course = await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json(new ApiError(404, 'Course not found'));
        }

        // const authorisedTeacher = course.teacherEmail.filter((val) => val === teacherEmail);

        // console.log("authorisedTeacher => ", authorisedTeacher);

        // if(!authorisedTeacher) {
        //     return res.status(404).json(new ApiError(404, 'Teacher not found'));
        // }

        // const path = req.files.lecture.path;

        const response = await lectureUploadOnCloudinary(outputPath);

        console.log(response);

        const lecture = await Lecture.create({
            lectureName,
            lectureDescription,
            courseCode,

            teacherEmail,

            videoLink: {
                public_id: response.public_id,
                private_url: response.secure_url
            }
        });

        return res.status(201).json(new ApiResponse(201, 'Lecture created successfully', lecture));
    } catch (error) {
        console.log('error => ', error);
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const sendSignedUrl = async (req, res) => {
    const courseCode = 'AIDS';
    const filename = `video-${courseCode}-${Date.now()}.mp4`;
    const ContentType = 'mp4';
    const command = new PutObjectCommand({
        Bucket: 'videostreaming31',
        Key: `uploads/user/${filename}`,
        ContentType: ContentType
    });

    const signedurl = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log(signedurl);

    res.status(200).json({ signedurl });
};

export {
    createCourse,
    updateCourse,
    deleteCourse,
    sendSignedUrl,
    getCourses,
    getCourseByCode,

    // lectures routes
    uploadLectures
};
