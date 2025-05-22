import multer from "multer";

const storage = multer.memoryStorage();


const upload = multer({ storage: multer.memoryStorage() });

export default upload;
