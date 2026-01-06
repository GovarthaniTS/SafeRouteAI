import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SegmentSafety {
  name: string;
  streetLighting: number;
  crowdPresence: number;
  nearbyShops: number;
  emergencyServices: number;
  cctvPresence: number;
  overallScore: number;
}

interface RouteData {
  routeIndex: number;
  distance: string;
  duration: string;
  safetyScore: number;
  segments: SegmentSafety[];
}

interface SafetyAnalysis {
  safestRouteIndex: number;
  routes: RouteData[];
  timeOfDayRisk: string;
  explanation?: string;
}

export function useRouteSafety() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const [explanation, setExplanation] = useState<string>("");

  const analyzeRoutes = async (source: string, destination: string) => {
    setIsLoading(true);
    setAnalysis(null);
    setExplanation("");

    try {
      // Simulate multiple routes (in production, this would come from Google Maps API)
      const mockRoutes = generateMockRoutes(source, destination);

      // Call the safety analysis edge function
      const { data: safetyData, error: safetyError } = await supabase.functions.invoke(
        "analyze-route-safety",
        {
          body: {
            routes: mockRoutes,
            timeOfDay: new Date().toISOString(),
          },
        }
      );

      if (safetyError) {
        console.error("Safety analysis error:", safetyError);
        toast.error("Failed to analyze route safety");
        return;
      }

      setAnalysis(safetyData);

      // Log the search
      await supabase.from("route_searches").insert({
        source_address: source,
        destination_address: destination,
        selected_route_index: safetyData.safestRouteIndex,
        safety_score: safetyData.routes[safetyData.safestRouteIndex].safetyScore,
      });

      // Get AI explanation
      setIsExplaining(true);
      const safestRoute = safetyData.routes[safetyData.safestRouteIndex];

      const { data: explainData, error: explainError } = await supabase.functions.invoke(
        "explain-route-safety",
        {
          body: {
            safestRoute,
            allRoutes: safetyData.routes,
            source,
            destination,
          },
        }
      );

      if (explainError) {
        console.error("AI explanation error:", explainError);
        toast.error("Couldn't generate AI explanation");
      } else {
        setExplanation(explainData.explanation);
      }

      toast.success("Safest route found!", {
        description: `Safety score: ${safestRoute.safetyScore}/10`,
      });

    } catch (error) {
      console.error("Route analysis failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsExplaining(false);
    }
  };

  return {
    isLoading,
    isExplaining,
    analysis,
    explanation,
    analyzeRoutes,
  };
}

// Generate mock route data for demo purposes
function generateMockRoutes(source: string, destination: string) {
  const distances = ["0.8 km", "1.2 km", "1.5 km"];
  const durations = ["10 min", "15 min", "18 min"];

  return Array.from({ length: 3 }, (_, index) => ({
    index,
    distance: distances[index],
    duration: durations[index],
    polyline: `mock_polyline_${index}`,
    source,
    destination,
  }));
}
