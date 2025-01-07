import Activity from './Activity';
import User from './User';

export default interface Notification {
    notificationId: number;
    message: string;
    opened: boolean;
    sent_dt: string;
    activity: Activity;
    user: User;
} 