import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface CustomAlertProps {
    type: 'success' | 'error';
    message: string;
}

export function CustomAlert({ type, message }: CustomAlertProps) {
    return (
        <Alert 
            variant={type === 'success' ? 'default' : 'destructive'}
            className={`
                fixed top-4 right-4 w-96 shadow-lg border-2 
                ${type === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-red-50 border-red-500 text-red-700'
                }
                transform transition-all duration-500 ease-in-out
                animate-in slide-in-from-right
            `}
        >
            <AlertTitle className="text-lg font-semibold flex items-center gap-2">
                {type === 'success' 
                    ? <CheckCircle className="h-5 w-5" />
                    : <XCircle className="h-5 w-5" />
                }
                {type === 'success' ? 'Successo!' : 'Errore'}
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm">
                {message}
            </AlertDescription>
        </Alert>
    );
} 