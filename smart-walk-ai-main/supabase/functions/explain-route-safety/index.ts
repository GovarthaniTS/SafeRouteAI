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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { safestRoute, allRoutes, source, destination } = await req.json();
    console.log("Generating AI explanation for route from", source, "to", destination);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for Gemini
    const prompt = buildExplanationPrompt(safestRoute, allRoutes, source, destination);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are SafeRoute AI, a friendly safety advisor that explains walking route safety to users. 
            Be concise, warm, and reassuring. Use simple language that anyone can understand.
            Focus on practical safety insights and explain WHY certain routes are safer.
            Keep your response under 150 words. Use bullet points for key safety features.
            Never use markdown headers. Start directly with your explanation.`
          },
          { role: "user", content: prompt }
        ],
        stream: false,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate explanation");
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "Unable to generate explanation.";

    console.log("AI explanation generated successfully");

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error generating explanation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildExplanationPrompt(safestRoute: RouteData, allRoutes: RouteData[], source: string, destination: string): string {
  const segments = safestRoute.segments;
  const avgLighting = segments.reduce((sum, s) => sum + s.streetLighting, 0) / segments.length;
  const avgCrowd = segments.reduce((sum, s) => sum + s.crowdPresence, 0) / segments.length;
  const avgShops = segments.reduce((sum, s) => sum + s.nearbyShops, 0) / segments.length;
  const avgEmergency = segments.reduce((sum, s) => sum + s.emergencyServices, 0) / segments.length;
  const avgCctv = segments.reduce((sum, s) => sum + s.cctvPresence, 0) / segments.length;

  const worstSegment = segments.reduce((worst, seg) => 
    seg.overallScore < worst.overallScore ? seg : worst, segments[0]);

  return `Explain why this walking route from "${source}" to "${destination}" is the safest option.

Route Details:
- Distance: ${safestRoute.distance}
- Duration: ${safestRoute.duration}
- Overall Safety Score: ${safestRoute.safetyScore}/10
- Compared against ${allRoutes.length - 1} other routes

Safety Breakdown (averages across ${segments.length} segments):
- Street Lighting: ${avgLighting.toFixed(1)}/10
- Crowd Presence: ${avgCrowd.toFixed(1)}/10
- Nearby Shops/Businesses: ${avgShops.toFixed(1)}/10
- Emergency Services Access: ${avgEmergency.toFixed(1)}/10
- CCTV Coverage: ${avgCctv.toFixed(1)}/10

Area with lowest score: "${worstSegment.name}" (${worstSegment.overallScore}/10)

Please provide a friendly, reassuring explanation of why this route was chosen and any tips for staying safe along the way.`;
}
