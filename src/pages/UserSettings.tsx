import { api, useAuth } from "@/contexts/AuthContext";
import { useStoreContext } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { useState, useEffect } from "react";

const UserSettings = () => {
    const { user } = useAuth();
    const { handleUserEdit, handlePasswordUpdate, handleUserDelete } = useStoreContext();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [alerts, setAlerts] = useState<{
        profile?: { type: "success" | "error"; message: string };
        password?: { type: "success" | "error"; message: string };
        delete?: { type: "success" | "error"; message: string };
    }>({});

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }
    }, [user]);

    const showAlert = (section: 'profile' | 'password' | 'delete', type: "success" | "error", message: string) => {
        setAlerts(prev => ({
            ...prev,
            [section]: { type, message }
        }));
        setTimeout(() => {
            setAlerts(prev => ({
                ...prev,
                [section]: undefined
            }));
        }, 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.userId) {
            try {
                handleUserEdit(user.userId, formData);
                showAlert(
                    "profile",
                    "success",
                    "Le modifiche al profilo sono state salvate con successo"
                );
            } catch (error) {
                showAlert(
                    "profile",
                    "error",
                    "Si è verificato un errore durante il salvataggio delle modifiche"
                );
            }
        }
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.userId && passwordForm.currentPassword && passwordForm.newPassword) {
            api.put(`/users/password/${user.userId}`, `password=${passwordForm.currentPassword}`)
                .then(() => {
                    handlePasswordUpdate(user.userId, passwordForm.newPassword);
                    showAlert(
                        "password",
                        "success",
                        "La password è stata aggiornata con successo"
                    );
                    setPasswordForm({ currentPassword: "", newPassword: "" });
                })
                .catch(() => {
                    showAlert(
                        "password",
                        "error",
                        "La password attuale non è corretta"
                    );
                });
        }
    };

    const handleDelete = () => {
        if (user?.userId && confirm("Sei sicuro di voler eliminare il tuo account?")) {
            try {
                handleUserDelete(user.userId);
                showAlert(
                    "delete",
                    "success",
                    "Il tuo account è stato eliminato con successo"
                );
            } catch (error) {
                showAlert(
                    "delete",
                    "error",
                    "Si è verificato un errore durante l'eliminazione dell'account"
                );
            }
        }
    };

    return (
        <div className="container max-w-2xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Modifica Profilo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome</label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cognome</label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <Button type="submit" className="w-fit">Salva Modifiche</Button>
                    </form>
                    {alerts.profile && (
                        <CustomAlert 
                            type={alerts.profile.type}
                            message={alerts.profile.message}
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Cambia Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password Attuale</label>
                            <Input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nuova Password</label>
                            <Input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value
                                })}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-fit"
                            disabled={!passwordForm.currentPassword || !passwordForm.newPassword}
                        >
                            Aggiorna Password
                        </Button>
                    </form>
                    {alerts.password && (
                        <CustomAlert 
                            type={alerts.password.type}
                            message={alerts.password.message}
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Elimina Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Questa azione è irreversibile.
                    </p>
                    <Button 
                        variant="destructive"
                        onClick={handleDelete}
                        className="w-fit"
                    >
                        Elimina Account
                    </Button>
                    {alerts.delete && (
                        <CustomAlert 
                            type={alerts.delete.type}
                            message={alerts.delete.message}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserSettings; 