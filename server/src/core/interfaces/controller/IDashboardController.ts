import { RequestHandler } from "express"


export interface IDashboardController{
    getDashboardData:RequestHandler
    getAdminDashboardData:RequestHandler
}