import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cloud, Droplets, Thermometer, Wind, MapPin, Navigation, Sun, CloudRain } from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CustomAlert } from "@/components/ui/CustomAlert";

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        wind_speed_10m: number;
        weather_code: number;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
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
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const fetchLocation = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`
            );
            const locationData = {
                city: response.data.city || response.data.locality || 'Città sconosciuta',
                region: response.data.principalSubdivision || response.data.countryName
            };
            setLocation(locationData);
            localStorage.setItem('weatherLocation', JSON.stringify({ lat, lon }));
        } catch (err) {
            showAlert('error', "Errore nel recupero della località");
        }
    };

    const fetchWeather = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            setWeather(response.data);
        } catch (err) {
            showAlert('error', "Impossibile recuperare i dati meteo");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (lat: number, lon: number) => {
        fetchWeather(lat, lon);
        fetchLocation(lat, lon);
        setShowSearch(false);
    };

    useEffect(() => {
        const { lat, lon } = getDefaultCoordinates();
        fetchWeather(lat, lon);
        fetchLocation(lat, lon);
    }, []);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                    fetchLocation(position.coords.latitude, position.coords.longitude);
                    showAlert('success', "Posizione aggiornata con successo");
                },
                (error) => {
                    showAlert('error', "Impossibile ottenere la posizione attuale");
                    setLoading(false);
                }
            );
        } else {
            showAlert('error', "Geolocalizzazione non supportata dal browser");
        }
    };

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-12 w-12 text-yellow-500" />;
        if (code >= 1 && code <= 3) return <Cloud className="h-12 w-12 text-gray-400" />;
        if (code >= 51 && code <= 67) return <CloudRain className="h-12 w-12 text-blue-400" />;
        return <Cloud className="h-12 w-12 text-gray-400" />;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' });
    };

    const getDefaultCoordinates = () => {
        const savedLocation = localStorage.getItem('weatherLocation');
        if (savedLocation) {
            return JSON.parse(savedLocation);
        }
        return { lat: 41.8919, lon: 12.5113 }; // Roma
    };

    if (loading) return (
        <Card className="animate-pulse">
            <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
            </CardContent>
        </Card>
    );
    
    if (!weather) return null;

    return (
        <>
            {alert && <CustomAlert type={alert.type} message={alert.message} />}
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-indigo-900/50">
                <CardHeader className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-2xl font-bold">Meteo Attuale</CardTitle>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            {location && (
                                <div className="flex items-center gap-2 text-muted-foreground bg-white/40 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
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
                                    className="bg-white/40 dark:bg-black/20 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-black/30"
                                >
                                    <Navigation className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Posizione Attuale</span>
                                    <span className="sm:hidden">Attuale</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="bg-white/40 dark:bg-black/20 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-black/30"
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
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="flex items-center justify-center p-8 bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-xl shadow-lg">
                                <div className="text-center">
                                    {getWeatherIcon(weather.current.weather_code)}
                                    <div className="mt-4">
                                        <p className="text-5xl font-bold tracking-tighter">
                                            {Math.round(weather.current.temperature_2m)}°C
                                        </p>
                                        <p className="text-lg text-muted-foreground mt-2">
                                            {getWeatherDescription(weather.current.weather_code)}
                                        </p>
                                    </div>
                                </div>
                            </div>
            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={cn(
                                    "p-6 rounded-xl bg-white/30 dark:bg-black/20 backdrop-blur-sm shadow-lg",
                                    "hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <Thermometer className="h-8 w-8 text-orange-500" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Percepita</p>
                                            <p className="text-2xl font-bold">{Math.round(weather.current.apparent_temperature)}°C</p>
                                        </div>
                                    </div>
                                </div>
            
                                <div className={cn(
                                    "p-6 rounded-xl bg-white/30 dark:bg-black/20 backdrop-blur-sm shadow-lg",
                                    "hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <Droplets className="h-8 w-8 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Umidità</p>
                                            <p className="text-2xl font-bold">{weather.current.relative_humidity_2m}%</p>
                                        </div>
                                    </div>
                                </div>
            
                                <div className={cn(
                                    "p-6 rounded-xl bg-white/30 dark:bg-black/20 backdrop-blur-sm shadow-lg",
                                    "hover:bg-white/40 dark:hover:bg-black/30 transition-colors",
                                    "col-span-1 sm:col-span-2"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <Wind className="h-8 w-8 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Vento</p>
                                            <p className="text-2xl font-bold">{Math.round(weather.current.wind_speed_10m)} km/h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {weather?.daily && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Previsioni per i prossimi giorni</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {weather.daily.time.slice(1, 6).map((date, index) => (
                                        <div 
                                            key={date}
                                            className="bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                                        >
                                            <p className="font-medium">{formatDate(date)}</p>
                                            <div className="my-2">
                                                {getWeatherIcon(weather.daily.weather_code[index + 1])}
                                            </div>
                                            <div className="flex justify-center gap-2 text-sm">
                                                <span className="text-red-500">
                                                    {Math.round(weather.daily.temperature_2m_max[index + 1])}°
                                                </span>
                                                <span className="text-blue-500">
                                                    {Math.round(weather.daily.temperature_2m_min[index + 1])}°
                                                </span>
                                            </div>
                                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                                {getWeatherDescription(weather.daily.weather_code[index + 1])}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default Weather; 