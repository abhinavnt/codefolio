import multer from "multer";

const storage = multer.memoryStorage();
console.log("multer setupil vannu");

const upload = multer({ storage: multer.memoryStorage() });

export default upload;
