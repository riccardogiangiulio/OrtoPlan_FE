import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sprout, MapPin, Calendar, List } from "lucide-react";
import Weather from "@/components/Weather";
import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import type Plant from "@/interfaces/Plant";
import type Plantation from "@/interfaces/Plantation";
import { useAuth } from "@/contexts/AuthContext";
import { CustomAlert } from "@/components/ui/CustomAlert";
import type Activity from "@/interfaces/Activity";
import type ActivityType from "@/interfaces/ActivityType";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentPlantations, setRecentPlantations] = useState<Plantation[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (user?.userId) {
            fetchData();
        }
    }, [user]);

    

    const fetchData = async () => {
        try {
            // Prima ottieni le piantagioni
            const plantationsRes = await api.get(`/plantations/user/${user?.userId}`);
            setRecentPlantations(plantationsRes.data.slice(0, 3));

            // Se ci sono piantagioni, ottieni le attività pendenti della prima piantagione
            if (plantationsRes.data.length > 0) {
                const [plantsRes, activitiesRes, activityTypesRes] = await Promise.all([
                    api.get("/plants"),
                    api.get(`/activities/plantation/${plantationsRes.data[0].plantationId}/pending`),
                    api.get("/activityTypes")
                ]);

                setPlants(plantsRes.data.slice(0, 3));
                setActivities(activitiesRes.data.slice(0, 3));
                setActivityTypes(activityTypesRes.data);
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: "Errore nel recupero dei dati della dashboard"
            });
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
                        {activities.length > 0 ? (
                            <div className="space-y-2">
                                {activities.map(activity => (
                                    <div 
                                        key={activity.activityId} 
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                    >
                                        <span>{activity.description}</span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(activity.scheduled_dt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nessuna attività programmata</p>
                        )}
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
                        {activityTypes.length > 0 ? (
                            <div className="space-y-2">
                                {activityTypes.map(type => (
                                    <div 
                                        key={type.activityTypeId} 
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                    >
                                        <span>{type.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nessun tipo di attività disponibile</p>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
