import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, Calendar, Sprout, MapPin } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlantationDialog } from '@/components/PlantationDialog';
import type Plantation from '@/interfaces/Plantation';
import { CustomAlert } from "@/components/ui/CustomAlert";

export default function PlantationDetails() {
    const { plantationId } = useParams();
    const [plantation, setPlantation] = useState<Plantation | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const plantationRes = await api.get(`/plantations/${plantationId}?include=plant`);
            const plantation = plantationRes.data;
            
            // Fetch plant details
            if (plantation.plant?.plantId) {
                const plantRes = await api.get(`/plants/${plantation.plant.plantId}`);
                plantation.plant = plantRes.data;
            }
            
            console.log("Plantation with plant details:", plantation);
            setPlantation(plantation);
        } catch (error) {
            console.error("Errore nel recupero dei dati:", error);
        }
    };

    useEffect(() => {
        if (plantationId) {
            fetchData();
        }
    }, [plantationId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/plantations/${plantationId}`);
            setShowDeleteDialog(false);
            setAlert({
                type: 'success',
                message: 'Piantagione eliminata con successo'
            });
            // Aspetta che l'utente veda la notifica prima di reindirizzare
            setTimeout(() => {
                navigate('/plantations');
            }, 1500);
        } catch (error: any) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Errore durante l\'eliminazione'
            });
            setShowDeleteDialog(false);
        }
        setTimeout(() => setAlert(null), 3000);
    };

    const handleEditSuccess = async (updatedPlantation?: Plantation) => {
        if (updatedPlantation) {
            // Fetch plant details
            if (updatedPlantation.plant?.plantId) {
                try {
                    const plantRes = await api.get(`/plants/${updatedPlantation.plant.plantId}`);
                    updatedPlantation.plant = plantRes.data;
                } catch (error) {
                    console.error("Errore nel recupero dei dettagli della pianta:", error);
                }
            }
            
            setPlantation(updatedPlantation);
            setAlert({
                type: 'success',
                message: 'Piantagione aggiornata con successo'
            });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {alert && <CustomAlert type={alert.type} message={alert.message} />}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">{plantation?.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {plantation?.city}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => navigate('/plantations')} className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Torna alle Piantagioni
                    </Button>
                    <Button onClick={() => setShowEditModal(true)} className="w-full sm:w-auto">
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifica
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Elimina
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            Dettagli Piantagione
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nome</p>
                                <p className="text-lg">{plantation?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Città</p>
                                <p className="text-lg">{plantation?.city}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Data Inizio</p>
                                <p className="text-lg">{plantation?.startDate && formatDate(plantation.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Data Fine</p>
                                <p className="text-lg">{plantation?.endDate && formatDate(plantation.endDate)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-green-600" />
                            Dettagli Pianta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nome Pianta</p>
                                <p className="text-lg">{plantation?.plant?.name || "Non specificato"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Descrizione</p>
                                <p className="text-lg">{plantation?.plant?.description || "Nessuna descrizione disponibile"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Inizio Coltivazione</p>
                                    <p className="text-lg">{plantation?.plant?.cultivationStart && formatDate(plantation.plant.cultivationStart)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Fine Coltivazione</p>
                                    <p className="text-lg">{plantation?.plant?.cultivationEnd && formatDate(plantation.plant.cultivationEnd)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PlantationDialog
                open={showEditModal}
                onOpenChange={setShowEditModal}
                plantation={plantation}
                onSuccess={handleEditSuccess}
            />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Questa azione non può essere annullata. Verranno eliminate anche tutte le attività associate.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Elimina
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 