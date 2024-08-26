import cloudinary from 'cloudinary';

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


const uploadOnCloudinary = (filePath) => {

    const response = cloudinary.uploader.upload(filePath,{

        path: '/uploads/',
        resource_type: 'auto',
        upload_preset: 'default'
    });

    console.log("response => ", response);

    return response;


}

export default uploadOnCloudinary;