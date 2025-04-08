import { supabase } from "../utils/supabaseClient";

// Define allowed values for activity log details
type ActivityLogValue = string | number | boolean | null | undefined;

export interface ActivityLogDetails {
  [key: string]: ActivityLogValue | ActivityLogValue[] | { [key: string]: ActivityLogValue };
}

export interface ActivityLog {
  id?: string;
  userId: string;
  action: string;
  entityType: "student" | "course" | "grade" | "system";
  entityId?: string;
  details?: ActivityLogDetails;
  timestamp?: string;
}

class ActivityLogger {
  private async log(activity: ActivityLog): Promise<void> {
    try {
      const { error } = await supabase.from("activity_logs").insert({
        ...activity,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to log activity:", error);
      // Don't throw - logging should not break the main flow
    }
  }

  async logStudentActivity(
    userId: string,
    action: string,
    studentId: string,
    details?: ActivityLogDetails
  ) {
    await this.log({
      userId,
      action,
      entityType: "student",
      entityId: studentId,
      details,
    });
  }

  async logCourseActivity(
    userId: string,
    action: string,
    courseId: string,
    details?: ActivityLogDetails
  ) {
    await this.log({
      userId,
      action,
      entityType: "course",
      entityId: courseId,
      details,
    });
  }

  async logGradeActivity(
    userId: string,
    action: string,
    gradeId: string,
    details?: ActivityLogDetails
  ) {
    await this.log({
      userId,
      action,
      entityType: "grade",
      entityId: gradeId,
      details,
    });
  }

  async logSystemActivity(
    userId: string,
    action: string,
    details?: ActivityLogDetails
  ) {
    await this.log({
      userId,
      action,
      entityType: "system",
      details,
    });
  }

  async getActivityLogs(
    options: {
      userId?: string;
      entityType?: ActivityLog["entityType"];
      entityId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<ActivityLog[]> {
    try {
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (options.userId) {
        query = query.eq("userId", options.userId);
      }
      if (options.entityType) {
        query = query.eq("entityType", options.entityType);
      }
      if (options.entityId) {
        query = query.eq("entityId", options.entityId);
      }
      if (options.startDate) {
        query = query.gte("timestamp", options.startDate.toISOString());
      }
      if (options.endDate) {
        query = query.lte("timestamp", options.endDate.toISOString());
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      return [];
    }
  }
}

export const activityLogger = new ActivityLogger();
