export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      document_notifications: {
        Row: {
          created_at: string
          creator_id: string
          document_ids: string[]
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          document_ids: string[]
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          document_ids?: string[]
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_notifications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: Database["public"]["Enums"]["document_category"]
          content_url: string | null
          created_at: string
          description: string | null
          file_size: number | null
          file_type: string | null
          id: string
          keywords: string[] | null
          language: string | null
          purpose: Database["public"]["Enums"]["document_purpose"][] | null
          region: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category: Database["public"]["Enums"]["document_category"]
          content_url?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          purpose?: Database["public"]["Enums"]["document_purpose"][] | null
          region?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: Database["public"]["Enums"]["document_category"]
          content_url?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          purpose?: Database["public"]["Enums"]["document_purpose"][] | null
          region?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      formation_settings: {
        Row: {
          created_at: string
          id: string
          selected_member_ids: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          selected_member_ids?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          selected_member_ids?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          active: boolean | null
          coordinator_image_url: string | null
          coordinator_message: string | null
          coordinator_name: string | null
          created_at: string | null
          id: string
          news_title: string | null
          quote_text: string | null
          quote_translation: string | null
          show_coordinator_section: boolean | null
          show_news_section: boolean | null
          subtitle: string
          title: string
          updated_at: string | null
          welcome_message: string
          welcome_title: string
        }
        Insert: {
          active?: boolean | null
          coordinator_image_url?: string | null
          coordinator_message?: string | null
          coordinator_name?: string | null
          created_at?: string | null
          id?: string
          news_title?: string | null
          quote_text?: string | null
          quote_translation?: string | null
          show_coordinator_section?: boolean | null
          show_news_section?: boolean | null
          subtitle?: string
          title?: string
          updated_at?: string | null
          welcome_message?: string
          welcome_title?: string
        }
        Update: {
          active?: boolean | null
          coordinator_image_url?: string | null
          coordinator_message?: string | null
          coordinator_name?: string | null
          created_at?: string | null
          id?: string
          news_title?: string | null
          quote_text?: string | null
          quote_translation?: string | null
          show_coordinator_section?: boolean | null
          show_news_section?: boolean | null
          subtitle?: string
          title?: string
          updated_at?: string | null
          welcome_message?: string
          welcome_title?: string
        }
        Relationships: []
      }
      notification_recipients: {
        Row: {
          id: string
          is_read: boolean | null
          notification_id: string
          notified_at: string
          recipient_id: string
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          notification_id: string
          notified_at?: string
          recipient_id: string
        }
        Update: {
          id?: string
          is_read?: boolean | null
          notification_id?: string
          notified_at?: string
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "document_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_date: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_approved: boolean | null
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["formee_status"] | null
        }
        Insert: {
          approval_date?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_approved?: boolean | null
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["formee_status"] | null
        }
        Update: {
          approval_date?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["formee_status"] | null
        }
        Relationships: []
      }
      syllabus_documents: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_public: boolean | null
          keywords: string[] | null
          language: string | null
          purpose: Database["public"]["Enums"]["document_purpose"][] | null
          region: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          keywords?: string[] | null
          language?: string | null
          purpose?: Database["public"]["Enums"]["document_purpose"][] | null
          region?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          keywords?: string[] | null
          language?: string | null
          purpose?: Database["public"]["Enums"]["document_purpose"][] | null
          region?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_introduction: {
        Row: {
          active: boolean
          coordinator_name: string
          created_at: string
          id: string
          left_column_content: string
          left_column_gallery_titles: string[] | null
          left_column_gallery_urls: string[] | null
          right_column_content: string
          right_column_gallery_titles: string[] | null
          right_column_gallery_urls: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          coordinator_name: string
          created_at?: string
          id?: string
          left_column_content: string
          left_column_gallery_titles?: string[] | null
          left_column_gallery_urls?: string[] | null
          right_column_content: string
          right_column_gallery_titles?: string[] | null
          right_column_gallery_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          coordinator_name?: string
          created_at?: string
          id?: string
          left_column_content?: string
          left_column_gallery_titles?: string[] | null
          left_column_gallery_urls?: string[] | null
          right_column_content?: string
          right_column_gallery_titles?: string[] | null
          right_column_gallery_urls?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      workshop_files: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          keywords: string[] | null
          language: string | null
          region: string | null
          title: string
          topics: string[] | null
          updated_at: string
          workshop_id: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          region?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
          workshop_id: string
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          region?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_files_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_name: string | null
          description: string | null
          file_path: string | null
          file_url: string | null
          folder_path: string | null
          id: string
          keywords: string[] | null
          language: string | null
          region: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          description?: string | null
          file_path?: string | null
          file_url?: string | null
          folder_path?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          region?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          description?: string | null
          file_path?: string | null
          file_url?: string | null
          folder_path?: string | null
          id?: string
          keywords?: string[] | null
          language?: string | null
          region?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      formee_introduction: {
        Row: {
          active: boolean | null
          coordinator_name: string | null
          created_at: string | null
          id: string | null
          left_column_content: string | null
          right_column_content: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          coordinator_name?: string | null
          created_at?: string | null
          id?: string | null
          left_column_content?: string | null
          right_column_content?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          coordinator_name?: string | null
          created_at?: string | null
          id?: string | null
          left_column_content?: string | null
          right_column_content?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_category_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: Database["public"]["Enums"]["document_category"]
          count: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      document_category:
        | "Articles"
        | "Source materials"
        | "Presentations"
        | "Formation Programs"
        | "Miscellaneous"
        | "Videos"
        | "Reflections 4 Dimensions"
      document_purpose:
        | "General"
        | "Novitiate"
        | "Postulancy"
        | "Scholasticate"
        | "Ongoing Formation"
      formee_status: "Scholastic" | "Postulant" | "Deacon" | "Novice" | "Other"
      user_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_category: [
        "Articles",
        "Source materials",
        "Presentations",
        "Formation Programs",
        "Miscellaneous",
        "Videos",
        "Reflections 4 Dimensions",
      ],
      document_purpose: [
        "General",
        "Novitiate",
        "Postulancy",
        "Scholasticate",
        "Ongoing Formation",
      ],
      formee_status: ["Scholastic", "Postulant", "Deacon", "Novice", "Other"],
      user_role: ["admin", "editor", "user"],
    },
  },
} as const
