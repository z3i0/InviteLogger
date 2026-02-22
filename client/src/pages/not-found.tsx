import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border-l-4 border-l-destructive">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-white">404 Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Did you get lost in the server channels? This page doesn't exist.
        </p>

        <Link href="/" className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold transition-all bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-primary/30">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
