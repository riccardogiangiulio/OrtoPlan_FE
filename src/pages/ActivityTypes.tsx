import { useState, useEffect } from "react";
import { api } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ActivityTypeDialog } from "@/components/ActivityTypeDialog";
import type ActivityType from "@/interfaces/ActivityType";
import { CustomAlert } from "@/components/ui/CustomAlert";

function ActivityTypes() {
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const fetchActivityTypes = async () => {
        try {
            const response = await api.get("/activityTypes");
            setActivityTypes(response.data);
        } catch (error) {
            showAlert('error', "Errore nel recupero dei tipi di attività");
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
                showAlert('success', "Tipo di attività eliminato con successo");
            } catch (error) {
                showAlert('error', "Errore nell'eliminazione del tipo di attività");
            }
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            {alert && <CustomAlert type={alert.type} message={alert.message} />}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Tipi di Attività</h1>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo Tipo di Attività
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityTypes.map(activityType => (
                    <Card key={activityType.activityTypeId}>
                        <CardHeader className="flex flex-row justify-between items-center pb-2">
                            <CardTitle className="text-lg font-semibold">{activityType.name}</CardTitle>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(activityType.activityTypeId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
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
                onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchActivityTypes();
                    showAlert('success', "Nuovo tipo di attività creato con successo");
                }}
            />
        </div>
    );
}

export default ActivityTypes;