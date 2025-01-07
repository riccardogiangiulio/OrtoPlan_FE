import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type Plantation from "@/interfaces/Plantation";
import type Plant from "@/interfaces/Plant";

interface PlantationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plantation?: Plantation | null;
    onSuccess: () => void;
}

export function PlantationDialog({ open, onOpenChange, plantation, onSuccess }: PlantationDialogProps) {
    const { user } = useAuth();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        city: "",
        plantId: ""
    });

    useEffect(() => {
        fetchPlants();
        if (plantation) {
            setFormData({
                name: plantation.name,
                startDate: plantation.startDate.split("T")[0],
                endDate: plantation.endDate.split("T")[0],
                city: plantation.city,
                plantId: plantation.plant.plantId.toString()
            });
        } else {
            setFormData({
                name: "",
                startDate: "",
                endDate: "",
                city: "",
                plantId: ""
            });
        }
    }, [plantation]);

    const fetchPlants = async () => {
        try {
            const response = await api.get("/plants");
            setPlants(response.data);
        } catch (error) {
            console.error("Errore nel recupero delle piante:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                city: formData.city,
                user: { userId: user?.userId },
                plant: { plantId: parseInt(formData.plantId) },
                plantationId: plantation?.plantationId
            };

            if (plantation) {
                await api.put(`/plantations/${plantation.plantationId}`, payload);
            } else {
                await api.post("/plantations", payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Errore nel salvataggio della piantagione:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {plantation ? "Modifica Piantagione" : "Nuova Piantagione"}
                    </DialogTitle>
                    <DialogDescription>
                        {plantation ? "Modifica i dettagli della piantagione" : "Crea una nuova piantagione"}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Inizio</label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Fine</label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Città</label>
                        <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pianta</label>
                        <select
                            value={formData.plantId}
                            onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            required
                        >
                            <option value="">Seleziona una pianta</option>
                            {plants.map((plant) => (
                                <option key={plant.plantId} value={plant.plantId}>
                                    {plant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit">
                            {plantation ? "Salva Modifiche" : "Crea"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 