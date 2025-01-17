import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { CustomAlert } from "@/components/ui/CustomAlert";

interface LocationSearchProps {
    onLocationSelect: (lat: number, lon: number) => void;
}

interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string; // state/region
    elevation?: number;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<GeocodingResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const searchLocation = async () => {
        if (!search.trim()) return;
        
        setLoading(true);
        try {
            const response = await axios.get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=5&language=it&format=json`
            );
            
            if (response.data.results) {
                setResults(response.data.results);
            } else {
                setResults([]);
                showAlert('error', "Nessun risultato trovato");
            }
        } catch (err) {
            console.error("Errore nella ricerca:", err);
            setResults([]);
            showAlert('error', "Errore durante la ricerca");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationClick = (result: GeocodingResult) => {
        if (typeof result.latitude === 'number' && typeof result.longitude === 'number') {
            onLocationSelect(result.latitude, result.longitude);
            setResults([]);
            setSearch("");
            showAlert('success', `Località selezionata: ${result.name}`);
        }
    };

    return (
        <div className="space-y-4">
            {alert && <CustomAlert type={alert.type} message={alert.message} />}
            
            <div className="flex gap-2">
                <Input
                    placeholder="Cerca una città..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            searchLocation();
                        }
                    }}
                    autoComplete="off"
                />
                <Button 
                    variant="outline" 
                    onClick={() => searchLocation()}
                    disabled={loading || !search.trim()}
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            
            {results.length > 0 && (
                <div className="bg-background border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.id}
                            className="w-full px-4 py-2 text-left hover:bg-accent first:rounded-t-md last:rounded-b-md flex items-center justify-between"
                            onClick={() => handleLocationClick(result)}
                            type="button"
                        >
                            <span>{result.name}</span>
                            <span className="text-sm text-muted-foreground">
                                {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}; 