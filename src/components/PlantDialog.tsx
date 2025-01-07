import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Plant from "@/interfaces/Plant";
import { api } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { CustomAlert } from "@/components/ui/CustomAlert";

interface PlantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plant: Plant | null;
    onSuccess: (plant?: Plant) => void;
}

export function PlantDialog({ open, onOpenChange, plant, onSuccess }: PlantDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        cultivationStart: "",
        cultivationEnd: "",
        harvestTime: 0
    });
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (plant) {
            setFormData({
                name: plant.name,
                description: plant.description || "",
                cultivationStart: plant.cultivationStart.split("T")[0],
                cultivationEnd: plant.cultivationEnd.split("T")[0],
                harvestTime: plant.harvestTime
            });
        } else {
            setFormData({
                name: "",
                description: "",
                cultivationStart: "",
                cultivationEnd: "",
                harvestTime: 0
            });
        }
    }, [plant]);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (plant) {
                await api.put(`/plants/${plant.plantId}`, formData);
            } else {
                await api.post("/plants", formData);
            }
            onSuccess(plant || undefined);
            onOpenChange(false);
        } catch (error) {
            showAlert('error', "Errore nel salvataggio della pianta");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {alert && <CustomAlert type={alert.type} message={alert.message} />}
                <DialogHeader>
                    <DialogTitle>{plant ? "Modifica Pianta" : "Aggiungi Pianta"}</DialogTitle>
                    <DialogDescription>
                        Visualizza o modifica i dettagli della tua pianta
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descrizione</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Inizio</label>
                            <Input
                                type="date"
                                value={formData.cultivationStart}
                                onChange={(e) => setFormData({ ...formData, cultivationStart: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Fine</label>
                            <Input
                                type="date"
                                value={formData.cultivationEnd}
                                onChange={(e) => setFormData({ ...formData, cultivationEnd: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tempo di Raccolta (giorni)</label>
                        <Input
                            type="number"
                            value={formData.harvestTime}
                            onChange={(e) => setFormData({ ...formData, harvestTime: parseInt(e.target.value) })}
                            required
                            min="0"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit">
                            {plant ? "Salva Modifiche" : "Aggiungi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 