import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Cloud, Calendar, Bell, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickActions = [
        {
            title: "Aggiungi Piantagione",
            icon: <Plus className="h-5 w-5" />,
            color: "text-green-600",
            onClick: () => console.log("Aggiungi pianta"),
        },
        {
            title: "Meteo",
            icon: <Cloud className="h-5 w-5" />,
            color: "text-blue-600",
            onClick: () => console.log("Visualizza meteo"),
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
        },
    ];

    const stats = [
        {
            title: "Piantagioni Attive",
            value: "12",
            icon: <Sprout className="h-4 w-4 text-green-600" />,
            description: "Piante in coltivazione"
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

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={action.onClick}
                    >
                        <span className={action.color}>{action.icon}</span>
                        {action.title}
                    </Button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
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

            {/* Recent Activities or Plants */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Le tue Piante</CardTitle>
                    <CardDescription>
                        Panoramica delle tue piante in coltivazione
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-gray-500 py-8">
                        Nessuna pianta aggiunta.
                        <br />
                        <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => console.log("Aggiungi pianta")}
                        >
                            Aggiungi la tua prima pianta
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
