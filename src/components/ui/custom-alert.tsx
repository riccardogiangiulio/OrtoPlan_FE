import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAlertProps {
    type: "success" | "error";
    title: string;
    message: string;
    className?: string;
}

export const CustomAlert = ({ type, title, message, className }: CustomAlertProps) => {
    return (
        <Alert 
            className={cn(
                "mt-4",
                type === "success" 
                    ? "border-green-500 bg-green-50 text-green-700" 
                    : "border-red-500 bg-red-50 text-red-700",
                className
            )}
        >
            {type === "success" ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />
            }
            <AlertTitle className="font-medium">
                {title}
            </AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
}; 