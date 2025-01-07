import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ActivityTypeDialog } from "@/components/ActivityTypeDialog";
import type ActivityType from "@/interfaces/ActivityType";
import { Alert } from "@/components/ui/alert";

function ActivityTypes() {
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'destructive'; message: string } | null>(null);

    const fetchActivityTypes = async () => {
        try {
            const response = await api.get("/activityTypes");
            setActivityTypes(response.data);
        } catch (error) {
            console.error("Errore nel recupero dei tipi di attività:", error);
        }
    };

    useEffect(() => {
        fetchActivityTypes();
    }, []);

    const handleDelete = async (activityTypeId: number) => {
        if (confirm("Sei sicuro di voler eliminare questo tipo di attività?")) {
            try {
                await api.delete(`/activityTypes/${activityTypeId}`);
                setActivityTypes(activityTypes.filter(at => at.activityTypeId !== activityTypeId));
            } catch (error) {
                console.error("Errore nell'eliminazione del tipo di attività:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Tipi di Attività</h1>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo Tipo di Attività
                </Button>
            </div>

            {alert && (
                <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
                    {/* ... Alert content ... */}
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityTypes.map(activityType => (
                    <Card key={activityType.activityTypeId}>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <CardTitle>{activityType.name}</CardTitle>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                        setSelectedActivityType(activityType);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDelete(activityType.activityTypeId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Utilizzato per categorizzare le attività nel tuo orto
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ActivityTypeDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                activityType={selectedActivityType}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchActivityTypes();
                }}
            />
        </div>
    );
}

export default ActivityTypes;