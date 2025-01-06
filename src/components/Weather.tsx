import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cloud, Droplets, Thermometer, Wind, MapPin, Navigation } from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { Button } from "./ui/button";

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        wind_speed_10m: number;
        weather_code: number;
    };
}

interface LocationData {
    city: string;
    region: string;
}

const getWeatherDescription = (code: number): string => {
    // Codici meteo da https://open-meteo.com/en/docs
    const weatherCodes: { [key: number]: string } = {
        0: "Sereno",
        1: "Prevalentemente sereno",
        2: "Parzialmente nuvoloso",
        3: "Nuvoloso",
        45: "Nebbia",
        48: "Nebbia con brina",
        51: "Pioggerella leggera",
        53: "Pioggerella moderata",
        55: "Pioggerella intensa",
        61: "Pioggia leggera",
        63: "Pioggia moderata",
        65: "Pioggia forte",
        71: "Neve leggera",
        73: "Neve moderata",
        75: "Neve forte",
        95: "Temporale",
    };
    return weatherCodes[code] || "Non disponibile";
};

const Weather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    const fetchLocation = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`
            );
            setLocation({
                city: response.data.city || response.data.locality || 'Città sconosciuta',
                region: response.data.principalSubdivision || response.data.countryName
            });
        } catch (err) {
            console.error("Errore nel recupero della località:", err);
            setLocation(null);
        }
    };

    const fetchWeather = async (lat: number, lon: number) => {
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            setError("Coordinate non valide");
            return;
        }

        setLoading(true);
        try {
            await fetchLocation(lat, lon);
            
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`
            );
            
            if (!response.data || !response.data.current) {
                throw new Error("Dati meteo non disponibili");
            }
            
            setWeather(response.data);
            setError(null);
        } catch (err) {
            console.error("Errore nel caricamento dei dati meteo:", err);
            setError("Errore nel caricamento dei dati meteo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Inizializza con Roma come posizione predefinita
        fetchWeather(41.89, 12.48);
    }, []);

    const handleLocationSelect = async (lat: number, lon: number) => {
        console.log("Weather: Nuova posizione selezionata:", lat, lon); // Debug
        try {
            setLoading(true);
            await fetchWeather(lat, lon);
            setShowSearch(false);
        } catch (error) {
            console.error("Errore nel cambio posizione:", error);
            setError("Errore nel cambio posizione");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Errore geolocalizzazione:", error);
                    setError("Impossibile ottenere la posizione attuale");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocalizzazione non supportata dal browser");
        }
    };

    if (loading) return <div>Caricamento dati meteo...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!weather) return null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Meteo Attuale</CardTitle>
                    <div className="flex items-center gap-2">
                        {location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">
                                    {location.city}, {location.region}
                                </span>
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleGetCurrentLocation}
                        >
                            <Navigation className="h-4 w-4 mr-2" />
                            Posizione Attuale
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            Cambia località
                        </Button>
                    </div>
                </div>
                {showSearch && (
                    <div className="mt-4">
                        <LocationSearch onLocationSelect={handleLocationSelect} />
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm font-medium">Temperatura</p>
                            <p className="text-2xl">{Math.round(weather.current.temperature_2m)}°C</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-sm font-medium">Percepita</p>
                            <p className="text-2xl">{Math.round(weather.current.apparent_temperature)}°C</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium">Umidità</p>
                            <p className="text-2xl">{weather.current.relative_humidity_2m}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium">Vento</p>
                            <p className="text-2xl">{Math.round(weather.current.wind_speed_10m)} km/h</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-lg">
                        {getWeatherDescription(weather.current.weather_code)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Weather; 