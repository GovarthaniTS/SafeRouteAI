import { Shield, Lightbulb, Users, Store, Building2, Camera, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentSafety {
  name: string;
  streetLighting: number;
  crowdPresence: number;
  nearbyShops: number;
  emergencyServices: number;
  cctvPresence: number;
  overallScore: number;
}

interface SafetyScoreCardProps {
  score: number;
  distance: string;
  duration: string;
  segments: SegmentSafety[];
  timeOfDayRisk: string;
  isSelected?: boolean;
}

export function SafetyScoreCard({
  score,
  distance,
  duration,
  segments,
  timeOfDayRisk,
  isSelected = false,
}: SafetyScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-primary";
    if (score >= 5) return "text-accent";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 7) return "safety-badge-high";
    if (score >= 5) return "safety-badge-medium";
    return "safety-badge-low";
  };

  const avgScores = {
    lighting: segments.reduce((sum, s) => sum + s.streetLighting, 0) / segments.length,
    crowd: segments.reduce((sum, s) => sum + s.crowdPresence, 0) / segments.length,
    shops: segments.reduce((sum, s) => sum + s.nearbyShops, 0) / segments.length,
    emergency: segments.reduce((sum, s) => sum + s.emergencyServices, 0) / segments.length,
    cctv: segments.reduce((sum, s) => sum + s.cctvPresence, 0) / segments.length,
  };

  return (
    <div
      className={cn(
        "glass-card p-5 space-y-4 transition-all duration-300",
        isSelected && "ring-2 ring-primary/50 glow-effect"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className={cn("w-8 h-8", getScoreColor(score))} />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-3xl font-display font-bold", getScoreColor(score))}>
                {score.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">/10</span>
            </div>
            <p className="text-sm text-muted-foreground">Safety Score</p>
          </div>
        </div>

        {isSelected && (
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getScoreBadge(score))}>
            Safest Route
          </span>
        )}
      </div>

      {/* Route Info */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium text-foreground">{distance}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-border" />
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium text-foreground">{duration}</span>
        </div>
        {timeOfDayRisk === "elevated" && (
          <>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-accent text-xs">Night Mode</span>
          </>
        )}
      </div>

      {/* Safety Metrics */}
      <div className="grid grid-cols-5 gap-2">
        <SafetyMetric
          icon={<Lightbulb className="w-4 h-4" />}
          label="Lighting"
          score={avgScores.lighting}
        />
        <SafetyMetric
          icon={<Users className="w-4 h-4" />}
          label="Crowd"
          score={avgScores.crowd}
        />
        <SafetyMetric
          icon={<Store className="w-4 h-4" />}
          label="Shops"
          score={avgScores.shops}
        />
        <SafetyMetric
          icon={<Building2 className="w-4 h-4" />}
          label="Emergency"
          score={avgScores.emergency}
        />
        <SafetyMetric
          icon={<Camera className="w-4 h-4" />}
          label="CCTV"
          score={avgScores.cctv}
        />
      </div>

      {/* Segment Breakdown */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Route Segments
        </p>
        <div className="space-y-1.5">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg bg-secondary/30"
            >
              <span className="text-muted-foreground truncate max-w-[200px]">
                {segment.name}
              </span>
              <span className={cn("font-medium", getScoreColor(segment.overallScore))}>
                {segment.overallScore.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SafetyMetric({
  icon,
  label,
  score,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
}) {
  const getBarColor = (score: number) => {
    if (score >= 7) return "bg-primary";
    if (score >= 5) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-secondary/30">
      <div className="text-muted-foreground">{icon}</div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor(score))}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
