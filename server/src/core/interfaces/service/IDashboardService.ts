import { DashboardData } from "../../../services/dashboard.service";



export interface IDashboardService{
   getDashboardData(mentorId: string, filterType: string, filterValue?: string): Promise<DashboardData>
    getAdminDashboardData():Promise<any>
}