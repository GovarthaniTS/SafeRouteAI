import { Helmet } from "react-helmet-async";
import { Shield, Route, Brain, Clock, MapPin, ChevronRight } from "lucide-react";
import { RouteInput } from "@/components/RouteInput";
import { SafetyScoreCard } from "@/components/SafetyScoreCard";
import { AIExplanation } from "@/components/AIExplanation";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { useRouteSafety } from "@/hooks/useRouteSafety";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isLoading, isExplaining, analysis, explanation, analyzeRoutes } = useRouteSafety();

  const safestRoute = analysis?.routes[analysis.safestRouteIndex];

  return (
    <>
      <Helmet>
        <title>SafeRoute AI - Find the Safest Walking Route</title>
        <meta
          name="description"
          content="SafeRoute AI uses artificial intelligence to find the safest walking route based on street lighting, crowd presence, nearby shops, and emergency services."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        {/* Header */}
        <header className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  SafeRoute <span className="text-primary">AI</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">MVP Demo</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Safety Analysis</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              Walk with <span className="text-gradient">Confidence</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Find the safest walking route—not just the shortest. Our AI analyzes street lighting, 
              crowd presence, nearby businesses, and more.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Input & Results */}
            <div className="space-y-6">
              {/* Route Input Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Route className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">Plan Your Route</h3>
                </div>
                <RouteInput onSearch={analyzeRoutes} isLoading={isLoading} />
              </div>

              {/* Safety Score Card */}
              {safestRoute && (
                <div className="animate-fade-in">
                  <SafetyScoreCard
                    score={safestRoute.safetyScore}
                    distance={safestRoute.distance}
                    duration={safestRoute.duration}
                    segments={safestRoute.segments}
                    timeOfDayRisk={analysis?.timeOfDayRisk || "normal"}
                    isSelected
                  />
                </div>
              )}

              {/* AI Explanation */}
              {(isExplaining || explanation) && (
                <AIExplanation explanation={explanation} isLoading={isExplaining} />
              )}
            </div>

            {/* Right Column - Map */}
            <div className="lg:sticky lg:top-24 h-fit">
              <MapPlaceholder
                source={analysis ? "Starting Point" : undefined}
                destination={analysis ? "Destination" : undefined}
                routes={analysis?.routes}
                safestRouteIndex={analysis?.safestRouteIndex}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              How Safety is Calculated
            </h3>
            <p className="text-muted-foreground">
              Our AI evaluates multiple safety factors for every route segment
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { icon: "💡", label: "Street Lighting", desc: "Well-lit paths" },
              { icon: "👥", label: "Crowd Presence", desc: "Active foot traffic" },
              { icon: "🏪", label: "Nearby Shops", desc: "Open businesses" },
              { icon: "🏥", label: "Emergency Services", desc: "Hospitals & police" },
              { icon: "📹", label: "CCTV Coverage", desc: "Surveillance zones" },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-4 text-center hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-medium text-foreground text-sm">{feature.label}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              SafeRoute AI • Hackathon MVP Demo • Built with Lovable
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Note: This demo uses simulated data. Production version requires Google Maps API integration.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
