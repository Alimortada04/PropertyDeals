import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Property Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/properties">
            <Button size="lg">
              <Home className="h-4 w-4 mr-2" />
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}