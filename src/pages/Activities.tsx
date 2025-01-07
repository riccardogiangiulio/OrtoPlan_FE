import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { ActivityDialog } from "@/components/ActivityDialog";
import { CustomAlert } from "@/components/ui/CustomAlert";
import type Activity from "@/interfaces/Activity";
import type ActivityType from "@/interfaces/ActivityType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type Plantation from "@/interfaces/Plantation";

export default function Activities() {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [plantations, setPlantations] = useState<Plantation[]>([]);
    const [selectedPlantationId, setSelectedPlantationId] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const fetchPlantations = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/plantations/user/${user.userId}`);
            setPlantations(response.data);
            if (response.data.length > 0) {
                setSelectedPlantationId(response.data[0].plantationId.toString());
            }
        } catch (error) {
            showAlert('error', "Errore nel recupero delle piantagioni");
        }
    };

    const fetchActivities = async (plantationId: string) => {
        if (!plantationId) return;
        try {
            const response = await api.get(`/activities/plantation/${plantationId}`);
            setActivities(response.data);
        } catch (error) {
            console.error("Errore nel recupero delle attività:", error);
            setActivities([]);
        }
    };

    const fetchActivityTypes = async () => {
        try {
            const response = await api.get("/activityTypes");
            setActivityTypes(response.data);
        } catch (error) {
            console.error("Errore nel recupero dei tipi di attività:", error);
            setActivityTypes([]);
        }
    };

    useEffect(() => {
        fetchPlantations();
        fetchActivityTypes();
    }, [user]);

    useEffect(() => {
        if (selectedPlantationId) {
            fetchActivities(selectedPlantationId);
        }
    }, [selectedPlantationId]);

    const handleDelete = async (activityId: number) => {
        if (confirm("Sei sicuro di voler eliminare questa attività?")) {
            try {
                await api.delete(`/activities/${activityId}`);
                setActivities(activities.filter(a => a.activityId !== activityId));
                showAlert('success', "Attività eliminata con successo");
            } catch (error) {
                showAlert('error', "Errore nell'eliminazione dell'attività");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('it-IT');
    };

    const handleToggleComplete = async (activity: Activity) => {
        try {
            const updatedActivity = {
                activityId: activity.activityId,
                description: activity.description,
                scheduled_dt: activity.scheduled_dt,
                completed: !activity.completed,
                activityType: {
                    activityTypeId: activity.activityType.activityTypeId
                },
                plantation: {
                    plantationId: activity.plantation.plantationId
                }
            };
            
            const response = await api.put(`/activities/${activity.activityId}`, updatedActivity);
            
            if (response.status === 200) {
                setActivities(activities.map(a => 
                    a.activityId === activity.activityId ? response.data : a
                ));
                showAlert('success', `Attività ${!activity.completed ? 'completata' : 'riaperta'}`);
            }
        } catch (error: any) {
            showAlert('error', error.response?.data?.message || "Errore nell'aggiornamento dell'attività");
        }
    };

    const filteredActivities = activities
        .filter(activity => {
            if (filter === 'pending') return !activity.completed;
            if (filter === 'completed') return activity.completed;
            return true;
        })
        .sort((a, b) => new Date(a.scheduled_dt).getTime() - new Date(b.scheduled_dt).getTime());

    const handlePlantationChange = (value: string) => {
        setSelectedPlantationId(value);
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Attività</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-[200px]">
                        <Select
                            value={selectedPlantationId || ""}
                            onValueChange={handlePlantationChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleziona piantagione" />
                            </SelectTrigger>
                            <SelectContent>
                                {plantations.map((plantation) => (
                                    <SelectItem 
                                        key={plantation.plantationId} 
                                        value={plantation.plantationId.toString()}
                                    >
                                        {plantation.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button 
                        onClick={() => {
                            setSelectedActivity(null);
                            setIsDialogOpen(true);
                        }} 
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuova Attività
                    </Button>
                </div>
            </div>

            {alert && <CustomAlert type={alert.type} message={alert.message} />}

            <div className="grid grid-cols-1 gap-4">
                {filteredActivities.map((activity) => (
                    <Card key={activity.activityId}>
                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl">{activity.activityType.name}</CardTitle>
                                <CardDescription>{activity.plantation.name}</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={activity.completed ? "outline" : "default"}
                                    size="icon"
                                    onClick={() => handleToggleComplete(activity)}
                                    className={activity.completed ? "text-green-600" : ""}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                        setSelectedActivity(activity);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDelete(activity.activityId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{activity.description}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Programmata per: {formatDate(activity.scheduled_dt)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ActivityDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                activity={selectedActivity}
                plantationId={parseInt(selectedPlantationId)}
                activityTypes={activityTypes}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchActivities(selectedPlantationId);
                    showAlert('success', selectedActivity ? 
                        "Attività modificata con successo" : 
                        "Attività creata con successo"
                    );
                }}
            />
        </div>
    );
} 