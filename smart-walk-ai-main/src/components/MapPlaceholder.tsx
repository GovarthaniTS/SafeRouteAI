import { MapPin, Navigation, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteData {
  routeIndex: number;
  distance: string;
  duration: string;
  safetyScore: number;
}

interface MapPlaceholderProps {
  source?: string;
  destination?: string;
  routes?: RouteData[];
  safestRouteIndex?: number;
  isLoading?: boolean;
}

export function MapPlaceholder({
  source,
  destination,
  routes,
  safestRouteIndex,
  isLoading,
}: MapPlaceholderProps) {
  const hasRoute = source && destination && routes && routes.length > 0;

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-secondary/50 to-muted/30 rounded-2xl overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="relative">
              <RouteIcon className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring" />
            </div>
            <p className="text-muted-foreground font-medium">Analyzing routes...</p>
          </div>
        ) : hasRoute ? (
          <div className="w-full h-full flex flex-col">
            {/* Route Visualization */}
            <div className="flex-1 relative">
              {/* Source Point */}
              <div className="absolute top-8 left-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary glow-effect" />
                    <div className="absolute inset-0 rounded-full bg-primary/50 animate-pulse-ring" />
                  </div>
                  <div className="glass-card px-3 py-2">
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="text-sm font-medium truncate max-w-[150px]">{source}</p>
                  </div>
                </div>
              </div>

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {routes.map((route, index) => {
                  const isSafest = index === safestRouteIndex;
                  const yOffset = 60 + index * 30;
                  
                  return (
                    <g key={index}>
                      <path
                        d={`M 100 ${yOffset} Q 50% ${yOffset + 50} calc(100% - 100px) ${yOffset}`}
                        fill="none"
                        className={cn(
                          "transition-all duration-500",
                          isSafest ? "route-line-safe" : "route-line-caution"
                        )}
                        strokeLinecap="round"
                      />
                      {/* Route Label */}
                      <foreignObject x="45%" y={yOffset - 15} width="80" height="30">
                        <div
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium text-center",
                            isSafest
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-secondary/50 text-muted-foreground"
                          )}
                        >
                          {route.safetyScore.toFixed(1)}
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>

              {/* Destination Point */}
              <div className="absolute bottom-8 right-8">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="glass-card px-3 py-2 text-right">
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-sm font-medium truncate max-w-[150px]">{destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary rounded-full glow-effect" />
                <span className="text-xs text-muted-foreground">Safest Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-accent/60 rounded-full" />
                <span className="text-xs text-muted-foreground">Alternative</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative">
              <MapPin className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-display font-medium text-foreground">
                Enter your route
              </p>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Add a starting point and destination to find the safest walking route
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Note about Google Maps */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-xs text-muted-foreground/60">
          Demo visualization • Integrate Google Maps API for real routes
        </p>
      </div>
    </div>
  );
}
