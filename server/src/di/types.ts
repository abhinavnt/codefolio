import { BookingController } from "../controllers/mentor/booking.controller";
import { BookingRepository } from "../repositories/booking.repositories";
import { BookingService } from "../services/mentor/booking.service";


export const TYPES={
    //repositorys
    AuthRepository:Symbol.for('AuthRepository'),
    UserRepository:Symbol.for('UserRepository'),
    MentorRepository:Symbol.for('MentorRepository'),
    MentorReqRepository:Symbol.for('MentorReqRepository'),
    CourseRepository:Symbol.for('CourseRepository'),
    AdminRepository:Symbol.for('ADminRepository'),
    PaymentRepository:Symbol.for('PaymentRepository'),
    TaskRepository:Symbol.for('TaskRepository'),
    BookingRepository:Symbol.for('BookingRepository'),


    //services
    AdminService:Symbol.for('AdminService'),
    CourseServices:Symbol.for('CourseServices'),
    AuthService:Symbol.for('AuthService'),
    MentorReqService:Symbol.for('MentorReqService'),
    UserService:Symbol.for('UserService'),
    MentorService:Symbol.for('MentorService'),
    PaymentService:Symbol.for('PaymentService'),
    BookingService:Symbol.for('BookingService'),


    //Controllers
    UserController:Symbol.for('UserController'),
    MentorReqController:Symbol.for('MentorReqController'),
    AuthController:Symbol.for('AuthController'),
    AdminController:Symbol.for('AdminController'),
    CourseController:Symbol.for('CourseController'),
    MentorController:Symbol.for('MentorController'),
    PaymentController:Symbol.for('PaymentController'),
    BookingController:Symbol.for('BookingController')

}