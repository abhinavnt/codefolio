import { inject, injectable } from "inversify";
import cloudinary from "../../config/cloudinary";
import { ICourseController } from "../../core/interfaces/controller/ICourseController";
import { courseService } from "../../services/admin/course.service";
import { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { ICourseService } from "../../core/interfaces/service/ICourseService";
import asyncHandler from "express-async-handler";
// const CourseService = new courseService();

@injectable()
export class CourseController implements ICourseController {
  constructor(@inject(TYPES.CourseServices) private courseService:ICourseService){}


  addCourse=asyncHandler(async(req: Request, res: Response): Promise<void> =>{
    console.log('add course controller vannitund',req.body);

      const {
        title,
        description,
        category,
        level,
        price,
        duration,
        modules,
        learningPoints,
        targetedAudience,
        courseRequirements
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

            const courseData = {title,description,category, level, price, duration, image,modules:parsedModules,learningPoints,targetedAudience,courseRequirements};
            
             const newCourse = await this.courseService.addCourse(courseData);

      res.status(201).json({
        message: "Course and tasks created successfully",
        course: newCourse,
      });
  
  })

  getCourseById=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    console.log('reached the course controller');
    
          const courseId=req.params.id
          console.log(courseId,"course id from getcoursebyid");
           
          if(!courseId){
         res.status(400).json({ message: 'course id is required'})
          }

      const course=await this.courseService.getCourseById(courseId)
      console.log(course,"course chance und");
      
      res.status(200).json({course,message:"got the course"})

  })


}