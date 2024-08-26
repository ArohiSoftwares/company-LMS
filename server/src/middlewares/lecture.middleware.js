import multer from 'multer';

const thumbnailStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './uploads/thumbnails')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})


const lectureStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        
        cb(null, '/uploads/lectures')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    } 
})



const thumbnailUpload = multer({thumbnailStorage});

const lectureUpload = multer({lectureStorage});


export {lectureUpload, thumbnailUpload};