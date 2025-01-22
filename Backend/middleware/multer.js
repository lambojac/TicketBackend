import multer from 'multer';

// Memory storage to access the file as a buffer
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20 MB
    },
  });

export default upload;
