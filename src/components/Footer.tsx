import { Github, Mail, MapPin, Phone, Globe, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "./ui/button";

interface FooterProps {
    className?: string;
}

export function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`w-full border-t bg-background ${className}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Grid principale */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* Colonna 1: Info Azienda */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">SmartGarden</h3>
                        <p className="text-sm text-muted-foreground">
                            Innovazione e sostenibilità per il tuo orto. Gestisci le tue coltivazioni in modo intelligente.
                        </p>
                    </div>

                    {/* Colonna 2: Contatti */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contatti</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Via dell'Innovazione, 42 - Milano</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+39 02 1234567</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>info@smartgarden.it</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Globe className="h-4 w-4" />
                                <span>www.smartgarden.it</span>
                            </li>
                        </ul>
                    </div>

                    {/* Colonna 3: Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Iscriviti per ricevere aggiornamenti e consigli per il tuo orto.
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="La tua email"
                                className="px-3 py-2 rounded-md border bg-background"
                            />
                            <Button type="submit" className="w-full">
                                Iscriviti
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Separatore */}
                <div className="border-t my-8" />

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © 2024 SmartGarden. Tutti i diritti riservati.
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://github.com/riccardogiangiulio/OrtoPlan_FE"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <a
                            href="https://twitter.com/RiccardoGiangiulio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.facebook.com/riccardo.giangiulio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.instagram.com/riccardo.giangiulio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
} 