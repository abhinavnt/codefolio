import { DashboardData } from "../../../services/dashboard.service";



export interface IDashboardService{
    getDashboardData(mentorId: string): Promise<DashboardData>
    getAdminDashboardData():Promise<any>
}