import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import type Plantation  from "@/interfaces/Plantation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Edit, Trash2, MapPin, Plus } from "lucide-react";
import { PlantationDialog } from "@/components/PlantationDialog";
import Plant from "@/interfaces/Plant";

interface PlantationWithDetails extends Plantation {
    plantDetails?: Plant;
}

export default function Plantations() {
    const { user } = useAuth();
    const [plantations, setPlantations] = useState<PlantationWithDetails[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPlantation, setSelectedPlantation] = useState<Plantation | null>(null);

    const fetchPlantationDetails = async (plantations: Plantation[]) => {
        const updatedPlantations = await Promise.all(
            plantations.map(async (plantation) => {
                try {
                    const response = await api.get(`/plants/${plantation.plant.plantId}`);
                    return {
                        ...plantation,
                        plantDetails: response.data
                    };
                } catch (error) {
                    console.error(`Errore nel recupero dei dettagli della pianta ${plantation.plant.plantId}:`, error);
                    return plantation;
                }
            })
        );
        setPlantations(updatedPlantations);
    };

    const fetchPlantations = async () => {
        try {
            const response = await api.get(`/plantations/user/${user?.userId}`);
            await fetchPlantationDetails(response.data);
        } catch (error) {
            console.error("Errore nel recupero delle piantagioni:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPlantations();
        }
    }, [user]);

    const handleDelete = async (plantationId: number) => {
        if (confirm("Sei sicuro di voler eliminare questa piantagione?")) {
            try {
                await api.delete(`/plantations/${plantationId}`);
                setPlantations(plantations.filter(p => p.plantationId !== plantationId));
            } catch (error) {
                console.error("Errore nell'eliminazione della piantagione:", error);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    const handleAdd = () => {
        setSelectedPlantation(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Le Mie Piantagioni</h1>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuova Piantagione
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plantations.map((plantation) => (
                    <Card key={plantation.plantationId}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="text-xl font-bold">{plantation.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {plantation.plantDetails?.name || "Pianta non specificata"}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                        setSelectedPlantation(plantation);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDelete(plantation.plantationId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sprout className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">
                                        {plantation.plantDetails?.name || "Caricamento..."}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm">{plantation.city}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Periodo: {formatDate(plantation.startDate)} - {formatDate(plantation.endDate)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <PlantationDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                plantation={selectedPlantation}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchPlantations();
                }}
            />
        </div>
    );
} 