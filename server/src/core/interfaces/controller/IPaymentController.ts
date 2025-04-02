import { Request, Response,RequestHandler } from "express"




export interface IPaymentController{

    createCheckoutSession:RequestHandler
    verifyPayment:RequestHandler
}