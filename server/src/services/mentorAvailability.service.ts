import { inject, injectable } from "inversify";
import { IMentorAvailabilityService } from "../core/interfaces/service/IMentorAvailabilityService";
import { TYPES } from "../di/types";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { isAfter, parse } from "date-fns";
import { IMentorSpecificDateAvailability } from "../models/MentorAvailability";
import { IPurchasedTaskRepository } from "../core/interfaces/repository/IPurchaseTaskReposioty";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { UserRepository } from "../repositories/user.repository";

@injectable()
export class MentorAvailabilityService implements IMentorAvailabilityService {
  constructor(
    @inject(TYPES.MentorAvailabilityRepository) private mentorAvailabilityReposiotry: IMentorAvailabilityReposiotry,
    @inject(TYPES.PurchaseTaskRepository) private purchaseTaskRepository: IPurchasedTaskRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PurchaseTaskRepository) private taskRepository: IPurchasedTaskRepository
  ) {}

  async getMentorAvailability(mentorId: string): Promise<any> {
    const availability = await this.mentorAvailabilityReposiotry.findByMentorId(mentorId);
    return {
      data: availability.map((entry) => ({
        _id: entry._id,
        mentorId: entry.mentorId,
        specificDateAvailability: {
          date: entry.specificDateAvailability.date,
          timeSlots: entry.specificDateAvailability.timeSlots,
        },
      })),
    };
  }

  async addMentorTimeSlot(
    mentorId: string,
    date: Date,
    timeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<any> {
    const startTime = parse(timeSlot.startTime, "HH:mm", new Date());
    const endTime = parse(timeSlot.endTime, "HH:mm", new Date());
    if (!isAfter(endTime, startTime)) {
      throw new Error(`Invalid time slot on ${date}: End time must be after start time.`);
    }
    const result = await this.mentorAvailabilityReposiotry.addTimeSlot(mentorId, date, timeSlot);
    return {
      data: {
        _id: result._id,
        mentorId: result.mentorId,
        specificDateAvailability: {
          date: result.specificDateAvailability.date,
          timeSlots: result.specificDateAvailability.timeSlots,
        },
      },
    };
  }

  async editMentorTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    updatedTimeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<any> {
    console.log("reached service edimentorslot");

    // Validate time slot
    const startTime = parse(updatedTimeSlot.startTime, "HH:mm", new Date());
    const endTime = parse(updatedTimeSlot.endTime, "HH:mm", new Date());
    if (!isAfter(endTime, startTime)) {
      throw new Error(`Invalid time slot on ${date.toISOString()}: End time must be after start time.`);
    }

    // Call repository to update time slot
    const result = await this.mentorAvailabilityReposiotry.editTimeSlot(mentorId, date, timeSlotId, updatedTimeSlot);
    
    if (!result) {
      throw new Error("Time slot not found or could not be updated");
    }

    return {
      data: {
        _id: result._id,
        mentorId: result.mentorId,
        specificDateAvailability: {
          date: result.specificDateAvailability.date,
          timeSlots: result.specificDateAvailability.timeSlots,
        },
      },
    };
  }

  async deleteMentorTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string
  ): Promise<any> {
    const result = await this.mentorAvailabilityReposiotry.deleteTimeSlot(mentorId, date, timeSlotId);
    if (!result) {
      throw new Error("Time slot not found");
    }
    return {
      data: {
        _id: result._id,
        mentorId: result.mentorId,
        specificDateAvailability: {
          date: result.specificDateAvailability.date,
          timeSlots: result.specificDateAvailability.timeSlots,
        },
      },
    };
  }

  async getAllAvailableSlots(): Promise<any[]> {
    const availabilities = await this.mentorAvailabilityReposiotry.findAllWithMentor();
    return availabilities.flatMap((availability) => {
      const mentor = availability.mentorId as any;
      return availability.specificDateAvailability.timeSlots
        .filter((slot) => !slot.booked)
        .map((slot) => ({
          mentorId: mentor._id,
          mentorName: mentor.name,
          date: availability.specificDateAvailability.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));
    });
  }

  async bookTimeSlot(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string,
    userId: string,
    taskId: string
  ): Promise<IMentorSpecificDateAvailability> {
    if (!mentorId || !date || !startTime || !endTime || !userId || !taskId) {
      throw new Error("All fields (mentorId, date, startTime, endTime, userId, taskId) are required");
    }

    const roomId = uuidv4();

    const result = await this.mentorAvailabilityReposiotry.bookAvailbleTimeSlot(mentorId, date, startTime, endTime, userId, taskId, roomId);
    if (!result) {
      throw new Error("Time slot is already booked or not available");
    }

    const updateTask = await this.purchaseTaskRepository.updateByUserIdAndTaskId(userId, taskId, {
      $set: {
        reviewScheduled: true,
        meetId: roomId,
      },
      $push: {
        attempts: {
          submissionDate: new Date(),
          startTime,
          endTime,
          reviewDate: date,
        },
      },
    });

    if (!updateTask) {
      throw new Error("Task is not found in purchase task");
    }

    return result;
  }

  //booked
  async getReviewsByStatus(mentorId: string, status: string): Promise<any[]> {
    const timeSlots = await this.mentorAvailabilityReposiotry.findTimeSlotsByStatus(mentorId, status);
    const reviews = [];
    for (const slot of timeSlots) {
      console.log(slot.timeSlot.userId,"slot ");
      
      const user = await this.userRepository.findUserById(slot.timeSlot.userId);
      const task = await this.taskRepository.findTaskById(slot.timeSlot.taskId);
      console.log(user,"user from mentoravailbility");
      
      reviews.push({
        id: slot.timeSlot._id,
        date: slot.date,
        startTime: slot.timeSlot.startTime,
        endTime: slot.timeSlot.endTime,
        student: user
          ? {
              id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.profileImageUrl || "/placeholder.svg?height=40&width=40",
              jobTitle: user.title || "Unknown",
              company: user.title || "Unknown",
            }
          : null,
        task: task
          ? {
              id: task._id,
              title: task.title,
              type: "no type",
            }
          : null,
        status: slot.timeSlot.status,
        practicalMarks: slot.timeSlot.practicalMarks,
        theoryMarks: slot.timeSlot.theoryMarks,
        feedback: slot.timeSlot.feedback,
        meetingLink: slot.timeSlot.roomId,
      });
    }
    return reviews;
  }

  async markReviewAsCompleted(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    marks: { practical: number; theory: number },
    feedback: string
  ): Promise<void> {
    const timeSlot = await this.mentorAvailabilityReposiotry.updateTimeSlotStatus(mentorId, date, timeSlotId, "completed", marks, feedback);

    if (timeSlot && timeSlot.taskId && timeSlot.startTime && timeSlot.endTime) {
      await this.purchaseTaskRepository.updateTaskReview(
        timeSlot.taskId,
        timeSlot.startTime,
        timeSlot.endTime,
        mentorId,
        marks.theory,
        marks.practical
      );
    }
  }

  async markReviewAsCanceled(mentorId: string, date: Date, timeSlotId: string): Promise<void> {
    await this.mentorAvailabilityReposiotry.updateTimeSlotStatus(mentorId, date, timeSlotId, "canceled");
  }

  async editCompletedReview(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    marks: { practical: number; theory: number },
    feedback: string
  ): Promise<void> {
    const timeSlot = await this.mentorAvailabilityReposiotry.updateTimeSlotStatus(mentorId, date, timeSlotId, "completed", marks, feedback);
    if (timeSlot && timeSlot.taskId && timeSlot.startTime && timeSlot.endTime) {
      await this.purchaseTaskRepository.updateTaskReview(
        timeSlot.taskId,
        timeSlot.startTime,
        timeSlot.endTime,
        mentorId,
        marks.theory,
        marks.practical
      );
    } else {
      throw new Error("Failed to update time slot or required fields are missing");
    }
  }
}
