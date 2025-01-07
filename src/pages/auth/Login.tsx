import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const STORAGE_URL = import.meta.env.VITE_API_BACKEND_URL;

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const initialValues = {
    email: "",
    password: "",
};

const Login = () => {
    const { setAsLogged } = useAuth();
    const [error, setError] = useState<"generic" | "credentials" | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        defaultValues: initialValues,
        resolver: zodResolver(loginFormSchema),
    });

    const submitHandler: SubmitHandler<LoginFormValues> = (data) => {
        setError(null);
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
    
        axios
            .post(`${STORAGE_URL}/login`, formData)
            .then(({ data: { token } }) => {
                setAsLogged(token);
            })
            .catch((err) => {
                setError(err.response?.status === 401 ? "credentials" : "generic");
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Bentornato
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Accedi al tuo account per continuare
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
                        <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="email"
                                        {...register("email")}
                                        placeholder="nome@esempio.com"
                                        type="email"
                                        className="appearance-none block w-full"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <Input
                                        id="password"
                                        {...register("password")}
                                        placeholder="••••••••"
                                        type={isPasswordVisible ? "text" : "password"}
                                        className="appearance-none block w-full pr-10"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 size-8"
                                        variant="ghost"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <span className="pointer-events-none">
                                            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </span>
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Accesso in corso..." : "Accedi"}
                            </Button>
                        </form>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>
                                    {error === "credentials" ? "Credenziali non valide" : "Errore durante l'accesso"}
                                </AlertTitle>
                                <AlertDescription>
                                    {error === "credentials"
                                        ? "Le credenziali inserite non sono corrette."
                                        : "Si è verificato un errore durante l'accesso"}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                        Non hai un account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link to="/register">
                                    <Button variant="outline" className="w-full">
                                        Registrati
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;