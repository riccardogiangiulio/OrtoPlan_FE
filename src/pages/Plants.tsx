import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import Plant from "@/interfaces/Plant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { PlantDialog } from "@/components/PlantDialog";

export default function Plants() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const response = await api.get("/plants");
            setPlants(response.data);
        } catch (error) {
            console.error("Errore nel recupero delle piante:", error);
        }
    };

    const handleDelete = async (plantId: number) => {
        if (confirm("Sei sicuro di voler eliminare questa pianta?")) {
            try {
                await api.delete(`/plants/${plantId}`);
                setPlants(plants.filter(plant => plant.plantId !== plantId));
            } catch (error) {
                console.error("Errore nell'eliminazione della pianta:", error);
            }
        }
    };

    const handleEdit = (plant: Plant) => {
        setSelectedPlant(plant);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedPlant(null);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Le Mie Piante</h1>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Aggiungi Pianta
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant) => (
                    <Card key={plant.plantId}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{plant.name}</CardTitle>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(plant)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(plant.plantId)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{plant.description}</p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                        Periodo: {formatDate(plant.cultivationStart)} - {formatDate(plant.cultivationEnd)}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                        Tempo di raccolta: {plant.harvestTime} giorni
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <PlantDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
                plant={selectedPlant}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchPlants();
                }}
            />
        </div>
    );
} 