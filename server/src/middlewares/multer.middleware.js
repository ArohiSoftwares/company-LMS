import multer from 'multer';

const storage = multer.diskStorage({

    destination: (req, file, cb) => { /// where to upload the file 
        cb(null, './uploads/lectures');
    },

    filename: (req, file, cb) => {  /// set the file name in the server upload folder
        cb(null, file.originalname);
    }
})

export const upload = multer({storage});
