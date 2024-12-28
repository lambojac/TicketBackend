import multer from 'multer';

// Memory storage to access the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
