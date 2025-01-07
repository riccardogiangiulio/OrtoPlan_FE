import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/contexts/AuthContext";
import type ActivityType from "@/interfaces/ActivityType";

interface ActivityTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activityType?: ActivityType | null;
    onSuccess: () => void;
}

export function ActivityTypeDialog({ open, onOpenChange, activityType, onSuccess }: ActivityTypeDialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (activityType) {
            setName(activityType.name);
        } else {
            setName("");
        }
    }, [activityType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activityType) {
                await api.put(`/activityTypes/${activityType.activityTypeId}`, { name });
            } else {
                await api.post("/activityTypes", { name });
            }
            onSuccess();
        } catch (error) {
            console.error("Errore nel salvataggio del tipo di attività:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {activityType ? "Modifica Tipo di Attività" : "Nuovo Tipo di Attività"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit">
                            {activityType ? "Salva Modifiche" : "Crea"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}