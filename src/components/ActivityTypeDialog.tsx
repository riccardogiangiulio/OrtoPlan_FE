import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/contexts/AuthContext";
import type ActivityType from "@/interfaces/ActivityType";

interface ActivityTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (activityType?: ActivityType) => void;
}

export function ActivityTypeDialog({ open, onOpenChange, onSuccess }: ActivityTypeDialogProps) {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/activityTypes", { name });
            onSuccess(response.data);
            setName(""); // Reset form
            onOpenChange(false);
        } catch (error) {
            console.error("Errore nel salvataggio del tipo di attività:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuovo Tipo di Attività</DialogTitle>
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
                            Crea
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}