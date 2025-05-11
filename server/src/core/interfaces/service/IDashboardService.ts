import { DashboardData } from "../../../services/dashboard.service";



export interface IDashboardService{
   getDashboardData(mentorId: string, filterType: string, filterValue?: string): Promise<DashboardData>
    getAdminDashboardData():Promise<any>
    getDashboardDataUser(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"):Promise<any>
}