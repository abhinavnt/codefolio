import { Container } from "inversify";
import {TYPES} from './types'
import { IAuthController } from "../core/interfaces/controller/IAuthController";
import { AdminController } from "../controllers/admin/admin.controller";
import { AuthController } from "../controllers/auth/auth.controller";
import { IAuthService } from "../core/interfaces/service/IAuthService";
import { AuthService } from "../services/auth/auth.service";
import { IAuthRepository } from "../core/interfaces/repository/IAuthRepository";
import { AuthRepository } from "../repositories/auth.repository";
import { IUserController } from "../core/interfaces/controller/IUserController";
import { UserController } from "../controllers/user/user.controller";
import { IUserService } from "../core/interfaces/service/IUserService";
import { userService } from "../services/user/user.service";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IMentorReqController } from "../core/interfaces/controller/IMentorReqController";
import { MentorReqController } from "../controllers/mentor/mentorReq.controller";
import { IMentorReqService } from "../core/interfaces/service/IMentorReqService";
import { mentorReqService } from "../services/mentor/mentorReq.service";
import { IMentorReqRepository } from "../core/interfaces/repository/IMentorReqRepository";
import { MentorReqRepository } from "../repositories/mentorReq.repository";
import { IAdminController } from "../core/interfaces/controller/IAdminController";
import { IAdminService } from "../core/interfaces/service/IAdminService";
import { adminService } from "../services/admin/admin.service";
import { IAdminRepository } from "../core/interfaces/repository/IAdminRepository";
import { adminRepository } from "../repositories/admin.repository";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import { CourseController } from "../controllers/admin/course.controller";
import { ICourseService } from "../core/interfaces/service/ICourseService";
import { courseService } from "../services/admin/course.service";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { courseRepository } from "../repositories/course.repository";
import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { mentorRepository } from "../repositories/mentor.repository";
import { IMentorService } from "../core/interfaces/service/IMentorService";
import { MentorService } from "../services/mentor/mentor.service";
import { IMentorController } from "../core/interfaces/controller/IMentorController";
import { MentorController } from "../controllers/mentor/mentor.controller";
import { IPaymentRepository } from "../core/interfaces/repository/IPaymentRepository";
import { PaymentRepository } from "../repositories/payment.repository";
import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { TaskRepository } from "../repositories/task.repository";
import { IPaymentService } from "../core/interfaces/service/IPaymentService";
import { PaymentService } from "../services/user/payment.service";
import { IPaymentController } from "../core/interfaces/controller/IPaymentController";
import { PaymentController } from "../controllers/user/payment.controller";



const container=new Container()


container.bind<IAuthController>(TYPES.AuthController).to(AuthController)
container.bind<IAuthService>(TYPES.AuthService).to(AuthService)
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository)


container.bind<IUserController>(TYPES.UserController).to(UserController)
container.bind<IUserService>(TYPES.UserService).to(userService)
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)


container.bind<IMentorReqController>(TYPES.MentorReqController).to(MentorReqController)
container.bind<IMentorReqService>(TYPES.MentorReqService).to(mentorReqService)
container.bind<IMentorReqRepository>(TYPES.MentorReqRepository).to(MentorReqRepository)


container.bind<IAdminController>(TYPES.AdminController).to(AdminController)
container.bind<IAdminService>(TYPES.AdminService).to(adminService)
container.bind<IAdminRepository>(TYPES.AdminRepository).to(adminRepository)


container.bind<ICourseController>(TYPES.CourseController).to(CourseController)
container.bind<ICourseService>(TYPES.CourseServices).to(courseService)
container.bind<ICourseRepository>(TYPES.CourseRepository).to(courseRepository)


container.bind<IMentorController>(TYPES.MentorController).to(MentorController)
container.bind<IMentorService>(TYPES.MentorService).to(MentorService)
container.bind<IMentorRepository>(TYPES.MentorRepository).to(mentorRepository)


container.bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository)


container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController)
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService)
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository)

















export default container