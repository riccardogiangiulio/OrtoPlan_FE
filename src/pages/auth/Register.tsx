import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { CustomAlert } from "@/components/ui/CustomAlert";

const STORAGE_URL = import.meta.env.VITE_API_BACKEND_URL;

const registerFormSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const Register = () => {
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const navigate = useNavigate();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: initialValues,
        resolver: zodResolver(registerFormSchema),
    });

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const submitHandler: SubmitHandler<RegisterFormValues> = (data) => {
        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        };

        axios
            .post(`${STORAGE_URL}/users`, userData)
            .then(() => {
                showAlert('success', "Registrazione completata con successo");
                setTimeout(() => navigate("/login"), 2000);
            })
            .catch(() => {
                showAlert('error', "Si è verificato un errore durante la registrazione");
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {alert && <CustomAlert type={alert.type} message={alert.message} />}
                
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Crea il tuo account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Inizia a gestire il tuo orto in modo intelligente
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
                        <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nome
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            id="firstName"
                                            {...register("firstName")}
                                            placeholder="Mario"
                                            type="text"
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Cognome
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            id="lastName"
                                            {...register("lastName")}
                                            placeholder="Rossi"
                                            type="text"
                                        />
                                    </div>
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

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
                                        className="pr-10"
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Conferma Password
                                </label>
                                <div className="mt-1 relative">
                                    <Input
                                        id="confirmPassword"
                                        {...register("confirmPassword")}
                                        placeholder="••••••••"
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 size-8"
                                        variant="ghost"
                                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    >
                                        <span className="pointer-events-none">
                                            {isConfirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </span>
                                    </Button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Registrazione in corso..." : "Registrati"}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                        Hai già un account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full">
                                        Accedi
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

export default Register;
