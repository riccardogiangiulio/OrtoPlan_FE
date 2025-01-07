import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Sprout, MapPin, Plus, Calendar, List } from "lucide-react";
import Weather from "@/components/Weather";
import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import type Plant from "@/interfaces/Plant";
import type Plantation from "@/interfaces/Plantation";
import { useAuth } from "@/contexts/AuthContext";
import { CustomAlert } from "@/components/ui/CustomAlert";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentPlantations, setRecentPlantations] = useState<Plantation[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (user?.userId) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [plantationsRes, plantsRes] = await Promise.all([
                api.get(`/plantations/user/${user?.userId}`),
                api.get("/plants")
            ]);

            const plantations = plantationsRes.data || [];
            const plants = plantsRes.data || [];

            setRecentPlantations(plantations.slice(0, 3));
            setPlants(plants.slice(0, 3));
        } catch (error) {
            setAlert({
                type: 'error',
                message: "Errore nel recupero dei dati della dashboard"
            });
            setRecentPlantations([]);
            setPlants([]);
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {alert && <CustomAlert type={alert.type} message={alert.message} />}
            
            {/* Sezione Meteo */}
            <div className="mb-8">
                <Weather />
            </div>

            {/* Azioni Rapide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card 
                    className="hover:shadow-lg transition-all cursor-pointer" 
                    onClick={() => navigate('/plantations')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Le Mie Piantagioni
                        </CardTitle>
                        <CardDescription>
                            Gestisci e monitora le tue piantagioni attive
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentPlantations.length > 0 ? (
                            <div className="space-y-2">
                                {recentPlantations.map(plantation => (
                                    <div 
                                        key={plantation.plantationId}
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                    >
                                        <span>{plantation.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(plantation.startDate)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nessuna piantagione attiva</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/plants")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-green-600" />
                            Catalogo Piante
                        </CardTitle>
                        <CardDescription>
                            Esplora e gestisci il tuo catalogo di piante
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {plants.length > 0 ? (
                            <div className="space-y-2">
                                {plants.map(plant => (
                                    <div key={plant.plantId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span>{plant.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {plant.harvestTime} giorni
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nessuna pianta nel catalogo</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/activities")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Attività
                        </CardTitle>
                        <CardDescription>
                            Gestisci le attività del tuo orto
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Pianifica e monitora le tue attività</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/activity-types")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <List className="h-5 w-5 text-orange-600" />
                            Tipi di Attività
                        </CardTitle>
                        <CardDescription>
                            Gestisci i tipi di attività disponibili
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Personalizza i tipi di attività del tuo orto</p>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
