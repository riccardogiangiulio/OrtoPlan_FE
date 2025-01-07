import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { api } from "@/contexts/AuthContext";
import Notification from '@/interfaces/Notification';
import { Link } from 'react-router-dom';

export function NotificationCenter({ userId }: { userId: number }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/notifications/unread/${userId}`);
            const unreadNotifications = response.data.filter(
                (notif: Notification) => !notif.opened
            );
            setNotifications(unreadNotifications);
            setUnreadCount(unreadNotifications.length);
        } catch (error) {
            console.error('Errore nel recupero delle notifiche:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Polling ogni 30 secondi per nuove notifiche
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative p-2">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-80">
                    <div className="max-h-96 overflow-y-auto p-2">
                        {notifications.length === 0 ? (
                            <p className="text-center text-muted-foreground p-4">
                                Nessuna notifica non letta
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className="p-3 mb-2 rounded-lg border bg-accent"
                                >
                                    <p className="text-sm">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(notification.sent_dt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <Link 
                        to="/notifications" 
                        className="block p-2 text-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        Vedi tutte le notifiche
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 