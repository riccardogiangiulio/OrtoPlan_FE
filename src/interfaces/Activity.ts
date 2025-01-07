import type ActivityType from "./ActivityType";
import type Plantation from "./Plantation";

export default interface Activity {
    activityId: number;
    description: string;
    scheduled_dt: string; // formato "yyyy-MM-dd HH:mm:ss"
    completed: boolean;
    activityType: ActivityType;
    plantation: Plantation;
} 