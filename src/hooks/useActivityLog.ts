import { useCallback } from 'react';
import { activityLogger } from '../services/activityLog';
import { useAuthStore } from '../store/useAuthStore';

export function useActivityLog() {
  const { user } = useAuthStore();

  const logStudentActivity = useCallback((
    action: string,
    studentId: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;
    return activityLogger.logStudentActivity(user.id, action, studentId, details);
  }, [user]);

  const logCourseActivity = useCallback((
    action: string,
    courseId: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;
    return activityLogger.logCourseActivity(user.id, action, courseId, details);
  }, [user]);

  const logGradeActivity = useCallback((
    action: string,
    gradeId: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;
    return activityLogger.logGradeActivity(user.id, action, gradeId, details);
  }, [user]);

  const logSystemActivity = useCallback((
    action: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;
    return activityLogger.logSystemActivity(user.id, action, details);
  }, [user]);

  const getActivityLogs = useCallback(async (options = {}) => {
    if (!user) return [];
    return activityLogger.getActivityLogs({ userId: user.id, ...options });
  }, [user]);

  return {
    logStudentActivity,
    logCourseActivity,
    logGradeActivity,
    logSystemActivity,
    getActivityLogs,
  };
}