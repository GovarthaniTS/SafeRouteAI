export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      road_segments: {
        Row: {
          cctv_presence_score: number
          created_at: string
          crowd_presence_score: number
          emergency_services_score: number
          id: string
          latitude: number
          location_name: string
          longitude: number
          nearby_shops_score: number
          overall_safety_score: number | null
          segment_id: string
          street_lighting_score: number
          updated_at: string
        }
        Insert: {
          cctv_presence_score?: number
          created_at?: string
          crowd_presence_score?: number
          emergency_services_score?: number
          id?: string
          latitude: number
          location_name: string
          longitude: number
          nearby_shops_score?: number
          overall_safety_score?: number | null
          segment_id: string
          street_lighting_score?: number
          updated_at?: string
        }
        Update: {
          cctv_presence_score?: number
          created_at?: string
          crowd_presence_score?: number
          emergency_services_score?: number
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          nearby_shops_score?: number
          overall_safety_score?: number | null
          segment_id?: string
          street_lighting_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      route_searches: {
        Row: {
          dest_lat: number | null
          dest_lng: number | null
          destination_address: string
          id: string
          safety_score: number | null
          searched_at: string
          selected_route_index: number | null
          source_address: string
          source_lat: number | null
          source_lng: number | null
        }
        Insert: {
          dest_lat?: number | null
          dest_lng?: number | null
          destination_address: string
          id?: string
          safety_score?: number | null
          searched_at?: string
          selected_route_index?: number | null
          source_address: string
          source_lat?: number | null
          source_lng?: number | null
        }
        Update: {
          dest_lat?: number | null
          dest_lng?: number | null
          destination_address?: string
          id?: string
          safety_score?: number | null
          searched_at?: string
          selected_route_index?: number | null
          source_address?: string
          source_lat?: number | null
          source_lng?: number | null
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          description: string
          id: string
          latitude: number | null
          longitude: number | null
          report_type: string
          reported_at: string
          segment_id: string | null
          severity: number
        }
        Insert: {
          description: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          report_type: string
          reported_at?: string
          segment_id?: string | null
          severity?: number
        }
        Update: {
          description?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          report_type?: string
          reported_at?: string
          segment_id?: string | null
          severity?: number
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "road_segments"
            referencedColumns: ["segment_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
