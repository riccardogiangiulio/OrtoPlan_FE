import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Calendar, Bell, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Weather from "@/components/Weather";
import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import type Plant from "@/interfaces/Plant";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await api.get("/plants");
                setPlants(response.data);
            } catch (error) {
                console.error("Errore nel recupero delle piante:", error);
            }
        };
        fetchPlants();
    }, []);

    const quickActions = [
        {
            title: "Aggiungi Pianta",
            icon: <Plus className="h-5 w-5" />,
            color: "text-green-600",
            onClick: () => navigate("/plants"),
        },
        {
            title: "Calendario",
            icon: <Calendar className="h-5 w-5" />,
            color: "text-orange-600",
            onClick: () => console.log("Apri calendario"),
        },
        {
            title: "Notifiche",
            icon: <Bell className="h-5 w-5" />,
            color: "text-purple-600",
            onClick: () => console.log("Visualizza notifiche"),
        }
    ];

    const stats = [
        {
            title: "Piantagioni Attive",
            value: "12",
            icon: <Sprout className="h-4 w-4 text-green-600" />,
            description: "Piante in coltivazione",
            onClick: () => navigate("/plants")
        },
        {
            title: "Attività Pianificate",
            value: "5",
            icon: <Calendar className="h-4 w-4 text-orange-600" />,
            description: "Per questa settimana"
        },
        {
            title: "Notifiche",
            value: "3",
            icon: <Bell className="h-4 w-4 text-purple-600" />,
            description: "Non lette"
        }
    ];

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Benvenuto, {user?.firstName}!
                    </h1>
                    <p className="text-gray-600">
                        Gestisci il tuo orto in modo intelligente
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate("/settings")}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>

            {/* Weather Component */}
            <div className="mb-6">
                <Weather />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200"
                        onClick={action.onClick}
                    >
                        <span className={action.color}>{action.icon}</span>
                        {action.title}
                    </Button>
                ))}
            </div>

            {/* Stats con link alle piante */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Card 
                        key={index} 
                        className={`cursor-pointer hover:shadow-md transition-all ${stat.onClick ? 'hover:border-green-200' : ''}`}
                        onClick={stat.onClick}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Card Piante con CTA */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Piante disponibili</CardTitle>
                            <CardDescription>
                                Gestisci il tuo orto in modo semplice
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={() => navigate("/plants")}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Aggiungi Pianta
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {plants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plants.slice(0, 3).map((plant) => (
                                <div 
                                    key={plant.plantId}
                                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate("/plants")}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Sprout className="h-5 w-5 text-green-600" />
                                        <h3 className="font-semibold">{plant.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {plant.description || "Nessuna descrizione"}
                                    </p>
                                    <div className="text-xs text-gray-600">
                                        Raccolta tra {plant.harvestTime} giorni
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Inizia a Coltivare</h3>
                            <p className="text-gray-500 mb-4">
                                Non hai ancora aggiunto nessuna pianta. Inizia ora!
                            </p>
                            <Button 
                                onClick={() => navigate("/plants")}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Aggiungi la tua prima pianta
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
