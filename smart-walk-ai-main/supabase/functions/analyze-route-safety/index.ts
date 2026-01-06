import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteData {
  routeIndex: number;
  distance: string;
  duration: string;
  safetyScore: number;
  segments: SegmentSafety[];
}

interface SegmentSafety {
  name: string;
  streetLighting: number;
  crowdPresence: number;
  nearbyShops: number;
  emergencyServices: number;
  cctvPresence: number;
  overallScore: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { routes, timeOfDay } = await req.json();
    console.log("Analyzing safety for", routes?.length || 0, "routes at time:", timeOfDay);

    if (!routes || routes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No routes provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate time-of-day risk modifier
    const hour = new Date().getHours();
    const isNightTime = hour < 6 || hour > 20;
    const timeRiskModifier = isNightTime ? 0.7 : 1.0; // Reduce scores at night

    // Analyze each route and calculate safety scores
    const analyzedRoutes: RouteData[] = routes.map((route: any, index: number) => {
      // Generate simulated segment safety data based on route characteristics
      const segments = generateSegmentSafety(route, timeRiskModifier);
      
      // Calculate overall route safety score
      const avgScore = segments.reduce((sum, seg) => sum + seg.overallScore, 0) / segments.length;
      const safetyScore = Math.round(avgScore * 10) / 10;

      return {
        routeIndex: index,
        distance: route.distance || "Unknown",
        duration: route.duration || "Unknown",
        safetyScore,
        segments
      };
    });

    // Sort by safety score (highest first) and select safest route
    analyzedRoutes.sort((a, b) => b.safetyScore - a.safetyScore);
    const safestRoute = analyzedRoutes[0];

    console.log("Analysis complete. Safest route index:", safestRoute.routeIndex, "Score:", safestRoute.safetyScore);

    return new Response(
      JSON.stringify({
        safestRouteIndex: safestRoute.routeIndex,
        routes: analyzedRoutes,
        timeOfDayRisk: isNightTime ? "elevated" : "normal"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error analyzing route safety:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSegmentSafety(route: any, timeModifier: number): SegmentSafety[] {
  // Simulate different areas along the route with varying safety profiles
  const areaTypes = [
    { name: "Commercial District", lighting: 9, crowd: 8, shops: 9, emergency: 7, cctv: 8 },
    { name: "Residential Area", lighting: 7, crowd: 5, shops: 5, emergency: 6, cctv: 6 },
    { name: "Main Street", lighting: 9, crowd: 9, shops: 8, emergency: 8, cctv: 9 },
    { name: "Park Area", lighting: 5, crowd: 4, shops: 2, emergency: 4, cctv: 4 },
    { name: "Transit Hub", lighting: 8, crowd: 9, shops: 7, emergency: 8, cctv: 9 },
    { name: "University Zone", lighting: 8, crowd: 7, shops: 6, emergency: 7, cctv: 8 },
    { name: "Industrial Area", lighting: 4, crowd: 2, shops: 2, emergency: 4, cctv: 5 },
    { name: "Hospital District", lighting: 9, crowd: 7, shops: 6, emergency: 10, cctv: 8 },
  ];

  // Generate 3-5 segments per route with some randomization
  const numSegments = 3 + Math.floor(Math.random() * 3);
  const segments: SegmentSafety[] = [];

  for (let i = 0; i < numSegments; i++) {
    const area = areaTypes[Math.floor(Math.random() * areaTypes.length)];
    
    // Add some variance to scores
    const variance = () => Math.floor(Math.random() * 3) - 1;
    
    const lighting = Math.max(1, Math.min(10, area.lighting + variance()));
    const crowd = Math.max(1, Math.min(10, area.crowd + variance()));
    const shops = Math.max(1, Math.min(10, area.shops + variance()));
    const emergency = Math.max(1, Math.min(10, area.emergency + variance()));
    const cctv = Math.max(1, Math.min(10, area.cctv + variance()));
    
    const baseScore = (lighting + crowd + shops + emergency + cctv) / 5;
    const overallScore = Math.round(baseScore * timeModifier * 10) / 10;

    segments.push({
      name: `${area.name} - Section ${i + 1}`,
      streetLighting: lighting,
      crowdPresence: crowd,
      nearbyShops: shops,
      emergencyServices: emergency,
      cctvPresence: cctv,
      overallScore
    });
  }

  return segments;
}
