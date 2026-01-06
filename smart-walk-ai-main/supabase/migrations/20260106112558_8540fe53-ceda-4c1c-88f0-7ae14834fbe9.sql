-- Create road_segments table for storing safety data about road segments
CREATE TABLE public.road_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_id TEXT NOT NULL UNIQUE,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  street_lighting_score INTEGER NOT NULL DEFAULT 5 CHECK (street_lighting_score >= 1 AND street_lighting_score <= 10),
  crowd_presence_score INTEGER NOT NULL DEFAULT 5 CHECK (crowd_presence_score >= 1 AND crowd_presence_score <= 10),
  nearby_shops_score INTEGER NOT NULL DEFAULT 5 CHECK (nearby_shops_score >= 1 AND nearby_shops_score <= 10),
  emergency_services_score INTEGER NOT NULL DEFAULT 5 CHECK (emergency_services_score >= 1 AND emergency_services_score <= 10),
  cctv_presence_score INTEGER NOT NULL DEFAULT 5 CHECK (cctv_presence_score >= 1 AND cctv_presence_score <= 10),
  overall_safety_score DECIMAL(3, 1) GENERATED ALWAYS AS (
    (street_lighting_score + crowd_presence_score + nearby_shops_score + emergency_services_score + cctv_presence_score)::DECIMAL / 5
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safety_reports table for user-submitted reports
CREATE TABLE public.safety_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_id TEXT REFERENCES public.road_segments(segment_id),
  report_type TEXT NOT NULL CHECK (report_type IN ('incident', 'hazard', 'improvement', 'general')),
  description TEXT NOT NULL,
  severity INTEGER NOT NULL DEFAULT 5 CHECK (severity >= 1 AND severity <= 10),
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Create route_searches table to log searches
CREATE TABLE public.route_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  source_lat DECIMAL(10, 8),
  source_lng DECIMAL(11, 8),
  dest_lat DECIMAL(10, 8),
  dest_lng DECIMAL(11, 8),
  selected_route_index INTEGER,
  safety_score DECIMAL(3, 1),
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.road_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_searches ENABLE ROW LEVEL SECURITY;

-- Create public read policies for road segments (safety data should be public)
CREATE POLICY "Road segments are publicly readable" 
  ON public.road_segments 
  FOR SELECT 
  USING (true);

-- Safety reports should be publicly readable
CREATE POLICY "Safety reports are publicly readable" 
  ON public.safety_reports 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert safety reports (anonymous reporting)
CREATE POLICY "Anyone can submit safety reports" 
  ON public.safety_reports 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to log route searches
CREATE POLICY "Anyone can log route searches" 
  ON public.route_searches 
  FOR INSERT 
  WITH CHECK (true);

-- Route searches are publicly readable for analytics
CREATE POLICY "Route searches are publicly readable" 
  ON public.route_searches 
  FOR SELECT 
  USING (true);

-- Insert demo safety data for common road segments
INSERT INTO public.road_segments (segment_id, location_name, latitude, longitude, street_lighting_score, crowd_presence_score, nearby_shops_score, emergency_services_score, cctv_presence_score) VALUES
  ('seg_001', 'Main Street Central', 40.7128, -74.0060, 9, 8, 9, 8, 9),
  ('seg_002', 'Park Avenue South', 40.7489, -73.9680, 8, 7, 8, 7, 8),
  ('seg_003', 'Broadway Theater District', 40.7580, -73.9855, 10, 10, 10, 9, 10),
  ('seg_004', 'Industrial Zone East', 40.7282, -73.9942, 3, 2, 2, 4, 3),
  ('seg_005', 'Riverside Path', 40.7933, -73.9723, 6, 5, 3, 5, 4),
  ('seg_006', 'Downtown Business District', 40.7061, -74.0087, 9, 9, 9, 9, 9),
  ('seg_007', 'University Campus Area', 40.7295, -73.9965, 8, 8, 7, 8, 8),
  ('seg_008', 'Residential Midtown', 40.7549, -73.9840, 7, 6, 6, 7, 7),
  ('seg_009', 'Night Market District', 40.7614, -73.9776, 8, 9, 8, 6, 7),
  ('seg_010', 'Warehouse District', 40.7023, -74.0156, 4, 3, 3, 4, 5),
  ('seg_011', 'Hospital Complex', 40.7429, -73.9712, 8, 7, 7, 10, 8),
  ('seg_012', 'Transit Hub Plaza', 40.7527, -73.9772, 9, 10, 8, 8, 9),
  ('seg_013', 'Quiet Suburb Road', 40.7831, -73.9712, 5, 4, 4, 5, 4),
  ('seg_014', 'Commercial Strip Mall', 40.7112, -74.0055, 7, 6, 8, 6, 7),
  ('seg_015', 'Historic District Walk', 40.7484, -73.9857, 8, 7, 7, 7, 8);

-- Insert demo safety reports
INSERT INTO public.safety_reports (segment_id, report_type, description, severity, latitude, longitude) VALUES
  ('seg_004', 'hazard', 'Poor lighting at night, several street lamps not working', 7, 40.7282, -73.9942),
  ('seg_005', 'incident', 'Reported theft near the riverside path after dark', 8, 40.7933, -73.9723),
  ('seg_010', 'hazard', 'Isolated area with minimal foot traffic', 6, 40.7023, -74.0156),
  ('seg_001', 'improvement', 'New CCTV cameras installed last month', 2, 40.7128, -74.0060),
  ('seg_003', 'general', 'Well-lit area with constant police presence', 1, 40.7580, -73.9855);