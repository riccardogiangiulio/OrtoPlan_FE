import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cloud, Droplets, Thermometer, Wind, MapPin, Navigation, Sun, CloudRain } from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-12 w-12 text-yellow-500" />;
        if (code >= 1 && code <= 3) return <Cloud className="h-12 w-12 text-gray-400" />;
        if (code >= 51 && code <= 67) return <CloudRain className="h-12 w-12 text-blue-400" />;
        return <Cloud className="h-12 w-12 text-gray-400" />;
    };

    if (loading) return (
        <Card className="animate-pulse">
            <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
            </CardContent>
        </Card>
    );
    
    if (error) return (
        <Card className="border-red-200">
            <CardContent className="p-6">
                <div className="text-red-500 flex items-center justify-center">{error}</div>
            </CardContent>
        </Card>
    );
    
    if (!weather) return null;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-2xl font-bold">Meteo Attuale</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {location && (
                            <div className="flex items-center gap-2 text-muted-foreground bg-white/80 dark:bg-black/20 px-3 py-1 rounded-full">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {location.city}, {location.region}
                                </span>
                            </div>
                        )}
                        <div className="flex gap-2 ml-auto sm:ml-0">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleGetCurrentLocation}
                                className="bg-white/80 dark:bg-black/20"
                            >
                                <Navigation className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Posizione Attuale</span>
                                <span className="sm:hidden">Attuale</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowSearch(!showSearch)}
                                className="bg-white/80 dark:bg-black/20"
                            >
                                Cambia località
                            </Button>
                        </div>
                    </div>
                </div>
                {showSearch && (
                    <div className="mt-4 w-full">
                        <LocationSearch onLocationSelect={handleLocationSelect} />
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                        <div className="text-center">
                            {getWeatherIcon(weather.current.weather_code)}
                            <div className="mt-2">
                                <p className="text-4xl font-bold">
                                    {Math.round(weather.current.temperature_2m)}°C
                                </p>
                                <p className="text-lg text-muted-foreground">
                                    {getWeatherDescription(weather.current.weather_code)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={cn(
                            "p-4 rounded-xl bg-gradient-to-br",
                            "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
                        )}>
                            <div className="flex items-center gap-3">
                                <Thermometer className="h-8 w-8 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Percepita</p>
                                    <p className="text-2xl font-bold">{Math.round(weather.current.apparent_temperature)}°C</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "p-4 rounded-xl bg-gradient-to-br",
                            "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
                        )}>
                            <div className="flex items-center gap-3">
                                <Droplets className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Umidità</p>
                                    <p className="text-2xl font-bold">{weather.current.relative_humidity_2m}%</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "p-4 rounded-xl bg-gradient-to-br",
                            "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
                            "col-span-1 sm:col-span-2"
                        )}>
                            <div className="flex items-center gap-3">
                                <Wind className="h-8 w-8 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Vento</p>
                                    <p className="text-2xl font-bold">{Math.round(weather.current.wind_speed_10m)} km/h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Weather; 