import { useState } from "react";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteInputProps {
  onSearch: (source: string, destination: string) => void;
  isLoading: boolean;
}

export function RouteInput({ onSearch, isLoading }: RouteInputProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source.trim() && destination.trim()) {
      onSearch(source.trim(), destination.trim());
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSource(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Source Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <div className="w-3 h-3 rounded-full bg-primary glow-effect" />
          </div>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Starting point..."
            className="floating-input w-full pl-10 pr-12"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Use current location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Connection Line */}
        <div className="flex items-center pl-[1.125rem]">
          <div className="w-0.5 h-4 bg-border rounded-full" />
        </div>

        {/* Destination Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
            className="floating-input w-full pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={isLoading || !source.trim() || !destination.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Routes...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Find Safest Route
          </>
        )}
      </Button>
    </form>
  );
}
