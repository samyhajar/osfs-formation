export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          author_id: string | null;
          author_name: string | null;
          category: Database['public']['Enums']['document_category'];
          content_url: string | null;
          created_at: string;
          description: string | null;
          file_size: number | null;
          file_type: string | null;
          id: string;
          is_public: boolean | null;
          keywords: string[] | null;
          language: string | null;
          purpose: Database['public']['Enums']['document_purpose'][] | null;
          region: string | null;
          title: string;
          topics: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          author_name?: string | null;
          category: Database['public']['Enums']['document_category'];
          content_url?: string | null;
          created_at?: string;
          description?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          is_public?: boolean | null;
          keywords?: string[] | null;
          language?: string | null;
          purpose?: Database['public']['Enums']['document_purpose'][] | null;
          region?: string | null;
          title: string;
          topics?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          author_name?: string | null;
          category?: Database['public']['Enums']['document_category'];
          content_url?: string | null;
          created_at?: string;
          description?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          is_public?: boolean | null;
          keywords?: string[] | null;
          language?: string | null;
          purpose?: Database['public']['Enums']['document_purpose'][] | null;
          region?: string | null;
          title?: string;
          topics?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      formee_introduction: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          coordinator_name: string;
          left_column_content: string;
          right_column_content: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          coordinator_name: string;
          left_column_content: string;
          right_column_content: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          coordinator_name?: string;
          left_column_content?: string;
          right_column_content?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          role: Database['public']['Enums']['user_role'];
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id: string;
          name?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Relationships: [];
      };
      syllabus_documents: {
        Row: {
          author_id: string | null;
          author_name: string | null;
          category: Database['public']['Enums']['document_category'];
          created_at: string;
          description: string | null;
          file_path: string | null;
          file_size: number | null;
          file_type: string | null;
          id: string;
          is_public: boolean | null;
          keywords: string[] | null;
          language: string | null;
          purpose: Database['public']['Enums']['document_purpose'][] | null;
          region: string | null;
          title: string;
          topics: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          author_name?: string | null;
          category: Database['public']['Enums']['document_category'];
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          is_public?: boolean | null;
          keywords?: string[] | null;
          language?: string | null;
          purpose?: Database['public']['Enums']['document_purpose'][] | null;
          region?: string | null;
          title: string;
          topics?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          author_name?: string | null;
          category?: Database['public']['Enums']['document_category'];
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          is_public?: boolean | null;
          keywords?: string[] | null;
          language?: string | null;
          purpose?: Database['public']['Enums']['document_purpose'][] | null;
          region?: string | null;
          title?: string;
          topics?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_category_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          category: Database['public']['Enums']['document_category'];
          count: number;
        }[];
      };
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      document_category:
        | 'Articles'
        | 'Source materials'
        | 'Presentations'
        | 'Formation Programs'
        | 'Miscellaneous'
        | 'Videos'
        | 'Reflections 4 Dimensions';
      document_purpose:
        | 'General'
        | 'Novitiate'
        | 'Postulancy'
        | 'Scholasticate'
        | 'Ongoing Formation';
      user_role: 'admin' | 'formator' | 'formee';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      document_category: [
        'Articles',
        'Source materials',
        'Presentations',
        'Formation Programs',
        'Miscellaneous',
        'Videos',
        'Reflections 4 Dimensions',
      ],
      document_purpose: [
        'General',
        'Novitiate',
        'Postulancy',
        'Scholasticate',
        'Ongoing Formation',
      ],
      user_role: ['admin', 'formator', 'formee'],
    },
  },
} as const;
