

export const TYPES={
    //repositorys
    AuthRepository:Symbol.for('AuthRepository'),
    UserRepository:Symbol.for('UserRepository'),
    MentorRepository:Symbol.for('MentorRepository'),
    MentorReqRepository:Symbol.for('MentorReqRepository'),
    CourseRepository:Symbol.for('CourseRepository'),
    AdminRepository:Symbol.for('ADminRepository'),


    //services
    AdminService:Symbol.for('AdminService'),
    CourseServices:Symbol.for('CourseServices'),
    AuthService:Symbol.for('AuthService'),
    MentorReqService:Symbol.for('MentorReqService'),
    UserService:Symbol.for('UserService'),


    //Controllers
    UserController:Symbol.for('UserController'),
    MentorReqController:Symbol.for('MentorReqController'),
    AuthController:Symbol.for('AuthController'),
    AdminController:Symbol.for('AdminController'),
    CourseController:Symbol.for('CourseController')

}