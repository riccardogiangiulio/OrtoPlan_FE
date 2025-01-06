import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Calendar, Cloud, LineChart, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
    const { user } = useAuth();

    const features = [
        {
            icon: <Sprout className="h-12 w-12 text-green-600" />,
            title: "Gestione Piante",
            description: "Monitora e gestisci le tue piante orticole con facilità"
        },
        {
            icon: <Cloud className="h-12 w-12 text-blue-600" />,
            title: "Dati Meteo",
            description: "Accedi ai dati meteorologici in tempo reale per ottimizzare la coltivazione"
        },
        {
            icon: <Calendar className="h-12 w-12 text-orange-600" />,
            title: "Pianificazione",
            description: "Pianifica le tue attività di coltivazione in modo efficiente"
        },
        {
            icon: <LineChart className="h-12 w-12 text-purple-600" />,
            title: "Monitoraggio",
            description: "Tieni traccia della crescita e dello stato delle tue piante"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-green-50 to-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Gestisci il tuo orto in modo intelligente
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Ottimizza la coltivazione delle tue piante orticole con dati meteo 
                            in tempo reale e strumenti di pianificazione avanzati
                        </p>
                        <div className="space-x-4">
                            {user ? (
                                <Link to="/dashboard">
                                    <Button size="lg">
                                        Vai alla Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <Button size="lg">
                                            Inizia Gratuitamente
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button variant="outline" size="lg">
                                            Accedi
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Caratteristiche Principali
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-green-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Pronto a migliorare il tuo orto?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Unisciti a noi e inizia a coltivare in modo più intelligente
                    </p>
                    {!user && (
                        <Link to="/register">
                            <Button size="lg">
                                Inizia Ora
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Landing;
