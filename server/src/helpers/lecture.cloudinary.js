import cloudinary from 'cloudinary';
import fs from 'fs';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config({
    cloud_name: 'dsh5742fk',
    api_key: '899594559273632',
    api_secret: '9E2v2LfZFqO2qiFf1-yuZmO3JX8'
});

const thumbnailUploadOnCloudinary = async path => {
    try {
        const response = await cloudinary.uploader.upload(path, {
            path: './uploads/thumbnails',
            resource_type: 'image',
            upload_preset: 'default',

            transformation: {
                quality: 'auto',
                fetch_format: 'auto',
                crop: 'limit',
                width: 1280,
                height: 720,
                aspect_ratio: '16:9',
                gravity: 'auto',
                radius: 0,
                background: 'transparent'
            }
        });

        console.log(response);

        console.log('response =>', response);
        return response;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

const lectureUploadOnCloudinary = async path => {
    try {
        for (const file in path) {
            const result = await cloudinary.uploader.upload(file, {
                path: '/uploads/lectures/',
                resource_type: 'auto',
                upload_preset: 'default'
            });
            console.log(result);
        }
        const response = await cloudinary.uploader.upload(path, {
            path: '/uploads/lectures/',
            resource_type: 'auto',
            upload_preset: 'default'

            // transformation: {
            //     quality: 'auto',
            //     fetch_format: 'auto',
            //     crop: 'limit',
            //     width: 1280,
            //     height: 720,
            //     aspect_ratio: '16:9',
            //     gravity: 'auto',
            //     radius: 0,
            //     background: 'transparent',

            // }
        });

        console.log(response);
        for (const file in path) {
            fs.unlinkSync(file);
        }
        return response;
    } catch (error) {
        console.log(error);
        // fs.unlinkSync(path);
        return error;
    }
};

const documentUpload = async (path,email) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            path: `upload/teachers/${email}`,
            resource_type: 'auto',
            upload_preset: 'default'
        });
        return result;
    } catch (err) {
        console.log('Document Upload Error :', err);
        return err;
    }
};

export { documentUpload, thumbnailUploadOnCloudinary, lectureUploadOnCloudinary };
