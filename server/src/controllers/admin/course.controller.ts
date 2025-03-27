import cloudinary from "../../config/cloudinary";
import { ICourseController } from "../../core/interfaces/controller/ICourseController";
import { courseService } from "../../services/admin/course.service";
import { Request, Response } from "express";

const CourseService = new courseService();

export class CourseController implements ICourseController {
  
  async addCourse(req: Request, res: Response): Promise<void> {
    console.log('add course controller vannitund');
    
    try {

      const {
        title,
        description,
        category,
        level,
        price,
        duration,
        modules
      } = req.body;

    console.log(req.body);
    
      
     

      let image=''

      console.log(req.file,"files");
      

       if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).image) {
              const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
              console.log('Uploading profile image to Cloudinary...');
      
              await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'mentor_profiles' }, (error, result) => {
                  if (error) {
                    console.error('Cloudinary upload error (profile image):', error);
                    reject(error);
                    return;
                  }
                  if (result) {
                    image = result.secure_url;
                    resolve(result);
                  }
                }).end(files.image[0].buffer);
              });
            }

            const parsedModules = modules ? JSON.parse(modules) : [];

            const courseData = {title,description,category, level, price, duration, image,modules:parsedModules,};
            
             const newCourse = await CourseService.addCourse(courseData);

      res.status(201).json({
        message: "Course and tasks created successfully",
        course: newCourse,
      });
    } catch (error) {
      console.error("Error in addCourse controller:", error);
      res.status(500).json({ message: "Error creating course and tasks" });
    }
  }
}