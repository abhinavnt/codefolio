


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
    PurchaseTaskRepository:Symbol.for('PurchaseTaskRepository'),
    PurchaseCourseRepository:Symbol.for('PurchaseCourse'),
    MentorFeedbackRepository:Symbol.for('MentorFeedbackRepository'),
    CourseFeedbackRepository:Symbol.for('CourseFeedbackRepository'),
    WishlistRepository:Symbol.for('WishlistRepository'),
    MentorAvailabilityRepository:Symbol.for("MentorAvailabilityRepository"),
    PurchaseHistoryRepository:Symbol.for("PurchaseHistoryRepository"),
     

    //services
    AdminService:Symbol.for('AdminService'),
    CourseServices:Symbol.for('CourseServices'),
    AuthService:Symbol.for('AuthService'),
    MentorReqService:Symbol.for('MentorReqService'),
    UserService:Symbol.for('UserService'),
    MentorService:Symbol.for('MentorService'),
    PaymentService:Symbol.for('PaymentService'),
    BookingService:Symbol.for('BookingService'),
    FeedbackService:Symbol.for('FeedbackService'),
    WishlistService:Symbol.for('WishlistService'),
    MentorAvailabilityService:Symbol.for('MentorAvailabilityService'),

    //Controllers
    UserController:Symbol.for('UserController'),
    MentorReqController:Symbol.for('MentorReqController'),
    AuthController:Symbol.for('AuthController'),
    AdminController:Symbol.for('AdminController'),
    CourseController:Symbol.for('CourseController'),
    MentorController:Symbol.for('MentorController'),
    PaymentController:Symbol.for('PaymentController'),
    BookingController:Symbol.for('BookingController'),
    FeedbackController:Symbol.for('FeedbackController'),
    WishistController:Symbol.for(' WishistController'),
    MentorAvailabilityController:Symbol.for('MentorAvailabilityController')

}