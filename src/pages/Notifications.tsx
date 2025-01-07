import { useEffect, useState } from 'react';
import { api } from '@/contexts/AuthContext';
import Notification from '@/interfaces/Notification';
import Activity from '@/interfaces/Activity';
import Plantation from '@/interfaces/Plantation';
import { CustomAlert } from '@/components/ui/CustomAlert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [plantations, setPlantations] = useState<Plantation[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({
        message: '',
        activityId: '',
        plantationId: '',
    });
    const { user } = useAuth();

    const fetchPlantations = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/plantations/user/${user.userId}`);
            setPlantations(response.data);
        } catch (error) {
            showAlert('error', 'Errore nel recupero delle piantagioni');
        }
    };

    const fetchActivitiesByPlantation = async (plantationId: string) => {
        try {
            const response = await api.get(`/activities/plantation/${plantationId}`);
            setActivities(response.data);
        } catch (error) {
            showAlert('error', 'Errore nel recupero delle attività');
            setActivities([]);
        }
    };

    const handlePlantationChange = (plantationId: string) => {
        setNewNotification(prev => ({
            ...prev,
            plantationId,
            activityId: '' // Reset activity selection when plantation changes
        }));
        fetchActivitiesByPlantation(plantationId);
    };

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/notifications/unread/${user.userId}`);
            setNotifications(response.data);
        } catch (error) {
            showAlert('error', 'Errore nel recupero delle notifiche');
        }
    };

    const createNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

            const notification = {
                message: newNotification.message,
                sent_dt: formattedDate,
                opened: false,
                activity: { activityId: parseInt(newNotification.activityId) },
                user: { userId: user.userId }
            };

            await api.post('/notifications', notification);
            showAlert('success', 'Notifica creata con successo');
            setIsDialogOpen(false);
            setNewNotification({ message: '', activityId: '', plantationId: '' });
            fetchNotifications();
        } catch (error) {
            showAlert('error', 'Errore nella creazione della notifica');
        }
    };

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    useEffect(() => {
        fetchNotifications();
        fetchPlantations();
    }, [user]);

    const markAsRead = async (notificationId: number) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            setNotifications(notifications.map(notif => 
                notif.notificationId === notificationId 
                    ? { ...notif, opened: true }
                    : notif
            ));
            showAlert('success', 'Notifica segnata come letta');
        } catch (error) {
            showAlert('error', 'Errore nel marcare la notifica come letta');
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            await api.delete(`/notifications/${notificationId}`);
            setNotifications(notifications.filter(
                notif => notif.notificationId !== notificationId
            ));
            showAlert('success', 'Notifica eliminata con successo');
        } catch (error) {
            showAlert('error', 'Errore nell\'eliminazione della notifica');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Le Mie Notifiche</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Crea Notifica</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crea Nuova Notifica</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={createNotification} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Piantagione
                                </label>
                                <Select
                                    value={newNotification.plantationId}
                                    onValueChange={handlePlantationChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona una piantagione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plantations.map((plantation) => (
                                            <SelectItem 
                                                key={plantation.plantationId} 
                                                value={plantation.plantationId.toString()}
                                            >
                                                {plantation.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Attività
                                </label>
                                <Select
                                    value={newNotification.activityId}
                                    onValueChange={(value) => setNewNotification({
                                        ...newNotification,
                                        activityId: value
                                    })}
                                    disabled={!newNotification.plantationId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona un'attività" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activities.map((activity) => (
                                            <SelectItem 
                                                key={activity.activityId} 
                                                value={activity.activityId.toString()}
                                            >
                                                {activity.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Messaggio
                                </label>
                                <Textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({
                                        ...newNotification,
                                        message: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Crea Notifica
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {alert && <CustomAlert type={alert.type} message={alert.message} />}
            
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        Non hai notifiche non lette
                    </p>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`p-4 rounded-lg border ${
                                !notification.opened ? 'bg-accent' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p>{notification.message}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {new Date(notification.sent_dt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!notification.opened && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markAsRead(notification.notificationId)}
                                        >
                                            Segna come letto
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.notificationId)}
                                    >
                                        Elimina
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 