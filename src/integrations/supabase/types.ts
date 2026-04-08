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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_documents: {
        Row: {
          application_id: string
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          member_id: string | null
          uploaded_at: string
        }
        Insert: {
          application_id: string
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          member_id?: string | null
          uploaded_at?: string
        }
        Update: {
          application_id?: string
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          member_id?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_documents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          alumni_graduation_year: number | null
          alumni_school: string | null
          category: Database["public"]["Enums"]["applicant_category"] | null
          commitment_agreed: boolean | null
          created_at: string
          id: string
          motivation_statement: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
          venture_summary: string | null
          venture_title: string | null
        }
        Insert: {
          alumni_graduation_year?: number | null
          alumni_school?: string | null
          category?: Database["public"]["Enums"]["applicant_category"] | null
          commitment_agreed?: boolean | null
          created_at?: string
          id?: string
          motivation_statement?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          venture_summary?: string | null
          venture_title?: string | null
        }
        Update: {
          alumni_graduation_year?: number | null
          alumni_school?: string | null
          category?: Database["public"]["Enums"]["applicant_category"] | null
          commitment_agreed?: boolean | null
          created_at?: string
          id?: string
          motivation_statement?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          venture_summary?: string | null
          venture_title?: string | null
        }
        Relationships: []
      }
      founder_tracking: {
        Row: {
          alumni_support_notes: string | null
          application_id: string
          created_at: string
          follow_up_date: string | null
          funding_amount: number | null
          id: string
          incubator_participation: boolean | null
          investor_access_notes: string | null
          outcomes_notes: string | null
          registration_location: string | null
          startup_name: string | null
          startup_registered: boolean | null
          updated_at: string
        }
        Insert: {
          alumni_support_notes?: string | null
          application_id: string
          created_at?: string
          follow_up_date?: string | null
          funding_amount?: number | null
          id?: string
          incubator_participation?: boolean | null
          investor_access_notes?: string | null
          outcomes_notes?: string | null
          registration_location?: string | null
          startup_name?: string | null
          startup_registered?: boolean | null
          updated_at?: string
        }
        Update: {
          alumni_support_notes?: string | null
          application_id?: string
          created_at?: string
          follow_up_date?: string | null
          funding_amount?: number | null
          id?: string
          incubator_participation?: boolean | null
          investor_access_notes?: string | null
          outcomes_notes?: string | null
          registration_location?: string | null
          startup_name?: string | null
          startup_registered?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_tracking_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_records: {
        Row: {
          application_id: string
          created_at: string
          id: string
          mentor_name: string | null
          mentorship_assigned: boolean | null
          mentorship_end_date: string | null
          mentorship_notes: string | null
          mentorship_start_date: string | null
          mentorship_type: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          mentor_name?: string | null
          mentorship_assigned?: boolean | null
          mentorship_end_date?: string | null
          mentorship_notes?: string | null
          mentorship_start_date?: string | null
          mentorship_type?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          mentor_name?: string | null
          mentorship_assigned?: boolean | null
          mentorship_end_date?: string | null
          mentorship_notes?: string | null
          mentorship_start_date?: string | null
          mentorship_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_records_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          application_id: string
          created_at: string
          feasibility_score: number | null
          id: string
          innovation_potential_score: number | null
          motivation_commitment_score: number | null
          problem_significance_score: number | null
          review_status: string | null
          reviewed_at: string | null
          reviewer_comments: string | null
          reviewer_id: string | null
          sdg_impact_score: number | null
          team_capability_score: number | null
          updated_at: string
          weighted_total_score: number | null
        }
        Insert: {
          application_id: string
          created_at?: string
          feasibility_score?: number | null
          id?: string
          innovation_potential_score?: number | null
          motivation_commitment_score?: number | null
          problem_significance_score?: number | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewer_comments?: string | null
          reviewer_id?: string | null
          sdg_impact_score?: number | null
          team_capability_score?: number | null
          updated_at?: string
          weighted_total_score?: number | null
        }
        Update: {
          application_id?: string
          created_at?: string
          feasibility_score?: number | null
          id?: string
          innovation_potential_score?: number | null
          motivation_commitment_score?: number | null
          problem_significance_score?: number | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewer_comments?: string | null
          reviewer_id?: string | null
          sdg_impact_score?: number | null
          team_capability_score?: number | null
          updated_at?: string
          weighted_total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          application_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_main_applicant: boolean | null
          phone: string | null
          resume_url: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_main_applicant?: boolean | null
          phone?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_main_applicant?: boolean | null
          phone?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "applicant" | "reviewer" | "mentor" | "admin"
      applicant_category: "aksob_student" | "lau_other" | "alumni" | "other"
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "accepted"
        | "rejected"
        | "waitlisted"
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
    Enums: {
      app_role: ["applicant", "reviewer", "mentor", "admin"],
      applicant_category: ["aksob_student", "lau_other", "alumni", "other"],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "waitlisted",
      ],
    },
  },
} as const
