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
import { userService } from "../services/user.service"; 
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
import { courseService } from "../services/course.service"; 
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
import { PaymentService } from "../services/payment.service"; 
import { IPaymentController } from "../core/interfaces/controller/IPaymentController";
import { PaymentController } from "../controllers/user/payment.controller";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { BookingRepository } from "../repositories/booking.repositories";
import { IBookingService } from "../core/interfaces/service/IBookingServie";
import { BookingService } from "../services/booking.service"; 
import { IBookingController } from "../core/interfaces/controller/IBookingController";
import { BookingController } from "../controllers/mentor/booking.controller";
import { IPurchasedTaskRepository } from "../core/interfaces/repository/IPurchaseTaskReposioty";
import { PurchaseTaskRepository } from "../repositories/purchaseTask.repository";
import { IPurchaseCourseRepository } from "../core/interfaces/repository/IPurchasedCourse";
import { PurchaseCourseRepository } from "../repositories/purchaseCourse.repository";
import { IMentorFeedbackRepository } from "../core/interfaces/repository/IMentorFeedbackRepository";
import { MentorFeedbackRepository } from "../repositories/mentor.feedback.repository";
import { IFeedbackService } from "../core/interfaces/service/IFeedbackService";
import { FeedbackService } from "../services/feedback.service";
import { IFeedbackController } from "../core/interfaces/controller/IFeedbackController";
import { FeedbackController } from "../controllers/feedback.controller";
import { ICourseFeedbackRepository } from "../core/interfaces/repository/ICourseFeedbackRepository";
import { CourseFeedbackRepository } from "../repositories/course.feedback.repository";
import { IWishlistRepository } from "../core/interfaces/repository/IWishlistRepository";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { IWishlistService } from "../core/interfaces/service/IWishlistService";
import { WishlistService } from "../services/wishlist.service";
import { IWishlistController } from "../core/interfaces/controller/IWishlistController";
import { WishistController } from "../controllers/wishlist.controller";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { MentorAvailabilityRepository } from "../repositories/mentorAvailbility.repository";
import { IMentorAvailabilityService } from "../core/interfaces/service/IMentorAvailabilityService";
import { MentorAvailabilityService } from "../services/mentorAvailability.service";
import { IMentorAvailabilityController } from "../core/interfaces/controller/IMentorAvailabiltyController";
import { MentorAvailabilityController } from "../controllers/mentorAvailabilty.controller";
import { IPurchaseHistoryRepository } from "../core/interfaces/repository/IPurchaseHistory.repository";
import { PurchaseHistoryRepository } from "../repositories/purchase.history.repository";



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



container.bind<IBookingController>(TYPES.BookingController).to(BookingController)
container.bind<IBookingService>(TYPES.BookingService).to(BookingService)
container.bind<IBookingRepository>(TYPES.BookingRepository).to(BookingRepository)




container.bind<IPurchasedTaskRepository>(TYPES.PurchaseTaskRepository).to(PurchaseTaskRepository)
container.bind<IPurchaseCourseRepository>(TYPES.PurchaseCourseRepository).to(PurchaseCourseRepository)


container.bind<IFeedbackController>(TYPES.FeedbackController).to(FeedbackController)
container.bind<IFeedbackService>(TYPES.FeedbackService).to(FeedbackService)
container.bind<IMentorFeedbackRepository>(TYPES.MentorFeedbackRepository).to(MentorFeedbackRepository)
container.bind<ICourseFeedbackRepository>(TYPES.CourseFeedbackRepository).to(CourseFeedbackRepository)


container.bind<IWishlistController>(TYPES.WishistController).to(WishistController)
container.bind<IWishlistService>(TYPES.WishlistService).to(WishlistService)
container.bind<IWishlistRepository>(TYPES.WishlistRepository).to(WishlistRepository)


container.bind<IMentorAvailabilityController>(TYPES.MentorAvailabilityController).to(MentorAvailabilityController)
container.bind<IMentorAvailabilityService>(TYPES.MentorAvailabilityService).to(MentorAvailabilityService)
container.bind<IMentorAvailabilityReposiotry>(TYPES.MentorAvailabilityRepository).to(MentorAvailabilityRepository)


container.bind<IPurchaseHistoryRepository>(TYPES.PurchaseHistoryRepository).to(PurchaseHistoryRepository)



export default container