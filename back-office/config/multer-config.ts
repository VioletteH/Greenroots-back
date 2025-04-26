import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subfolder = 'uploads';
    
        if (req.originalUrl.includes('/forests')) {
          subfolder = 'uploads/forests';
        } else if (req.originalUrl.includes('/trees')) {
          subfolder = 'uploads/trees';
        }
    
        const fullPath = path.join('public', subfolder);

        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

export default upload;