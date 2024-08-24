// fileUpload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory
const uploadDir = path.join(__dirname, '../../assets/uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Extract file extension
        const ext = file.originalname.split('.').pop();
        // Construct a unique filename with a timestamp
        const filename =
            new Date().toISOString().replace(/:/g, '-') +
            '-' +
            Math.random().toString(36).substring(7) +
            '.' +
            ext;
        cb(null, filename);
    },
});

// File filter function to validate fields before saving
const fileFilter = (req, file, cb) => {
    const { name, level, description } = req.body;
    
    if (!name || !level || !description) {
        return cb(new Error('All fields are required'), false);
    }
    
    // Accept the file if validation passes
    cb(null, true);
};

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter, // Add the file filter
});

export default uploads;