import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/contexts/AuthContext";
import type Activity from "@/interfaces/Activity";
import type ActivityType from "@/interfaces/ActivityType";

interface ActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity: Activity | null;
    plantationId: number;
    activityTypes: ActivityType[];
    onSuccess: () => void;
}

export function ActivityDialog({
    open,
    onOpenChange,
    activity,
    plantationId,
    activityTypes,
    onSuccess
}: ActivityDialogProps) {
    const [formData, setFormData] = useState({
        description: "",
        scheduled_date: "",
        scheduled_time: "",
        activityTypeId: "",
        completed: false
    });

    useEffect(() => {
        if (activity) {
            const scheduledDate = new Date(activity.scheduled_dt);
            setFormData({
                description: activity.description,
                scheduled_date: scheduledDate.toISOString().split('T')[0],
                scheduled_time: scheduledDate.toTimeString().slice(0, 5),
                activityTypeId: activity.activityType.activityTypeId.toString(),
                completed: activity.completed
            });
        } else {
            setFormData({
                description: "",
                scheduled_date: "",
                scheduled_time: "",
                activityTypeId: "",
                completed: false
            });
        }
    }, [activity]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);
        const formatted_dt = scheduledDateTime.toISOString().slice(0, 19).replace('T', ' ');

        const payload = {
            description: formData.description,
            scheduled_dt: formatted_dt,
            completed: formData.completed,
            activityType: {
                activityTypeId: parseInt(formData.activityTypeId)
            },
            plantation: {
                plantationId: plantationId
            }
        };

        try {
            if (activity) {
                await api.put(`/activities/${activity.activityId}`, payload);
            } else {
                await api.post("/activities", payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Errore nel salvataggio dell'attività:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {activity ? "Modifica Attività" : "Nuova Attività"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo di Attività</label>
                        <select
                            value={formData.activityTypeId}
                            onChange={(e) => setFormData({ ...formData, activityTypeId: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            required
                        >
                            <option value="">Seleziona un tipo</option>
                            {activityTypes.map((type) => (
                                <option key={type.activityTypeId} value={type.activityTypeId}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descrizione</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data</label>
                            <Input
                                type="date"
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ora</label>
                            <Input
                                type="time"
                                value={formData.scheduled_time}
                                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.completed}
                            onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                            id="completed"
                        />
                        <label htmlFor="completed" className="text-sm font-medium">
                            Completata
                        </label>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit">
                            {activity ? "Salva Modifiche" : "Crea"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}