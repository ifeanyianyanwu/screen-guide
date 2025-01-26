import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = "Error", message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">{message}</AlertDescription>
    </Alert>
  );
}
