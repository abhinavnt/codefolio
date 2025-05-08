import { inject, injectable } from "inversify";
import { IDashboardService } from "../core/interfaces/service/IDashboardService";
import { TYPES } from "../di/types";
import { IMentorWalletRepository } from "../core/interfaces/repository/IMentorWalletRepository";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { IBooking } from "../models/Booking";
import { IMentorWallet } from "../models/MentorWallet";
import { format, subDays } from "date-fns";
import { IMentorSpecificDateAvailability } from "../models/MentorAvailability";
import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IPurchaseCourseRepository } from "../core/interfaces/repository/IPurchasedCourse";

export interface DashboardData {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  walletBalance: number;
  bookingStats: Array<{ date: string; bookings: number; revenue: number }>;
  recentTransactions: Array<{
    transactionId: string;
    date: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
  }>;
  upcomingSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
}

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.MentorWalletRepository) private mentorWallet: IMentorWalletRepository,
    @inject(TYPES.MentorAvailabilityRepository) private mentorAvailbilty: IMentorAvailabilityReposiotry,
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.CourseRepository) private courseRepository: ICourseRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PurchaseCourseRepository) private purchaseCourseRepository: IPurchaseCourseRepository
  ) {}

  async getDashboardData(mentorId: string): Promise<DashboardData> {
    const [bookings, walletTransactions, availability] = await Promise.all([
      this.bookingRepository.getMentorDashboardBookings(mentorId),
      this.mentorWallet.getDashboardWalletTransactions(mentorId),
      this.mentorAvailbilty.getDashboardUpcomingAvailability(mentorId),
    ]);

    // Calculate metrics
    const totalBookings: number = bookings.length;
    const pendingBookings: number = bookings.filter((b: IBooking) => b.status === "pending").length;
    const totalRevenue: number = bookings
      .filter((b: IBooking) => b.paymentStatus === "completed")
      .reduce((sum: number, b: IBooking) => sum + b.totalPrice, 0);

    const walletBalance: number = walletTransactions.reduce((balance: number, t: IMentorWallet) => {
      return t.type === "credit" ? balance + t.amount : balance - t.amount;
    }, 0);

    // Generate booking stats for last 7 days
    const bookingStats: Array<{ date: string; bookings: number; revenue: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dailyBookings = bookings.filter((b: IBooking) => format(new Date(b.date), "yyyy-MM-dd") === dateStr);
      bookingStats.push({
        date: format(date, "MMM dd"),
        bookings: dailyBookings.length,
        revenue: dailyBookings.reduce((sum: number, b: IBooking) => sum + b.totalPrice, 0),
      });
    }

    // Format transactions
    const recentTransactions = walletTransactions.slice(0, 5).map((t: IMentorWallet) => ({
      transactionId: t.transactionId,
      date: t.date.toISOString(),
      description: t.description,
      amount: t.amount,
      type: t.type,
    }));

    // Format upcoming slots
    const upcomingSlots = availability
      .flatMap((a: IMentorSpecificDateAvailability) =>
        a.specificDateAvailability.timeSlots
          .filter((slot) => slot.booked && slot.status === "upcoming")
          .map((slot) => ({
            date: a.specificDateAvailability.date.toISOString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: slot.status || "upcoming",
          }))
      )
      .slice(0, 5);

    return {
      totalBookings,
      pendingBookings,
      totalRevenue,
      walletBalance,
      bookingStats,
      recentTransactions,
      upcomingSlots,
    };
  }

  async getAdminDashboardData(): Promise<any> {
    const [
      enrolledCourses,
      activeCourses,
      completedCourses,
      totalStudents,
      totalEarning,
      coursesSold,
      totalUsers,
      totalMentors,
      enrollmentsByCategory,
      monthlyRevenue,
    ] = await Promise.all([
      this.courseRepository.getDashboardEnrolledCourses(),
      this.courseRepository.getDashboardActiveCourses(),
      this.purchaseCourseRepository.getDashboardCompletedCourses(),
      this.courseRepository.getDashboardTotalStudents(),
      this.courseRepository.getDashboardTotalEarning(),
      this.courseRepository.getDashboardCoursesSold(),
      this.userRepository.getDashboardTotalUsers(),
      this.mentorRepository.getDashboardTotalMentors(),
      this.courseRepository.getDashboardEnrollmentsByCategory(),
      this.courseRepository.getDashboardMonthlyRevenue(),
    ]);

    return {
      enrolledCourses,
      activeCourses,
      completedCourses,
      totalStudents,
      totalEarning,
      coursesSold,
      totalUsers,
      totalMentors,
      enrollmentsByCategory,
      monthlyRevenue,
    };
  }
}
