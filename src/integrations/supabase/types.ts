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
      archived_tasks: {
        Row: {
          archived_at: string | null
          description: string | null
          due_date: string | null
          id: string
          module_id: string | null
          original_task_id: string | null
          priority: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          original_task_id?: string | null
          priority?: string | null
          status: string
          title: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          original_task_id?: string | null
          priority?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "archived_tasks_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          academic_year: number
          course_id: string | null
          course_module_group: string | null
          created_at: string | null
          day_of_week: string
          end_time: string
          id: string
          module_code: string
          module_name: string
          module_type_id: string | null
          room: string
          semester: string
          start_time: string
        }
        Insert: {
          academic_year: number
          course_id?: string | null
          course_module_group?: string | null
          created_at?: string | null
          day_of_week: string
          end_time: string
          id?: string
          module_code: string
          module_name: string
          module_type_id?: string | null
          room: string
          semester: string
          start_time: string
        }
        Update: {
          academic_year?: number
          course_id?: string | null
          course_module_group?: string | null
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          id?: string
          module_code?: string
          module_name?: string
          module_type_id?: string | null
          room?: string
          semester?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_modules_module_type_id_fkey"
            columns: ["module_type_id"]
            isOneToOne: false
            referencedRelation: "module_types"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          academic_year: number | null
          course_code: string
          course_name: string
          created_at: string | null
          department_id: string | null
          group_count: number | null
          id: string
        }
        Insert: {
          academic_year?: number | null
          course_code: string
          course_name: string
          created_at?: string | null
          department_id?: string | null
          group_count?: number | null
          id?: string
        }
        Update: {
          academic_year?: number | null
          course_code?: string
          course_name?: string
          created_at?: string | null
          department_id?: string | null
          group_count?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          module_id: string | null
          question: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          question: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          question?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      module_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          credits: number | null
          description: string | null
          id: string
          module_code: string
          module_group_name: string | null
          module_title: string
          module_type: string
          semester: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          module_code: string
          module_group_name?: string | null
          module_title: string
          module_type: string
          semester: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          module_code?: string
          module_group_name?: string | null
          module_title?: string
          module_type?: string
          semester?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_year: string | null
          app_notifications: boolean | null
          avatar_url: string | null
          course_id: string | null
          created_at: string
          department: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          module_group: string | null
          phone_number: string | null
          semester: string | null
          sms_notifications: boolean | null
          student_id: string | null
          timetable_setup: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          academic_year?: string | null
          app_notifications?: boolean | null
          avatar_url?: string | null
          course_id?: string | null
          created_at?: string
          department?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          module_group?: string | null
          phone_number?: string | null
          semester?: string | null
          sms_notifications?: boolean | null
          student_id?: string | null
          timetable_setup?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          academic_year?: string | null
          app_notifications?: boolean | null
          avatar_url?: string | null
          course_id?: string | null
          created_at?: string
          department?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          module_group?: string | null
          phone_number?: string | null
          semester?: string | null
          sms_notifications?: boolean | null
          student_id?: string | null
          timetable_setup?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_activity: {
        Row: {
          content: string
          created_at: string | null
          id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_change_logs: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          object_name: string
          object_type: string
          operation: string
          schema_name: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          object_name: string
          object_type: string
          operation: string
          schema_name: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          object_name?: string
          object_type?: string
          operation?: string
          schema_name?: string
        }
        Relationships: []
      }
      schema_snapshots: {
        Row: {
          description: string | null
          foreign_keys: Json | null
          id: string
          indexes: Json | null
          snapshot_date: string | null
          table_info: Json | null
        }
        Insert: {
          description?: string | null
          foreign_keys?: Json | null
          id?: string
          indexes?: Json | null
          snapshot_date?: string | null
          table_info?: Json | null
        }
        Update: {
          description?: string | null
          foreign_keys?: Json | null
          id?: string
          indexes?: Json | null
          snapshot_date?: string | null
          table_info?: Json | null
        }
        Relationships: []
      }
      study_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          study_group_name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          study_group_name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          study_group_name?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string | null
          date: string
          duration: number
          id: string
          module_id: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          duration: number
          id?: string
          module_id?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          module_id?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          module_id: string | null
          priority: string | null
          status: string
          task_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          priority?: string | null
          status?: string
          task_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          priority?: string | null
          status?: string
          task_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_class_schedules: {
        Row: {
          class_name: string
          color: string
          created_at: string | null
          day: string
          end_time: string
          id: string
          location: string
          module_id: string | null
          start_time: string
          teacher: string
          user_id: string
        }
        Insert: {
          class_name: string
          color: string
          created_at?: string | null
          day: string
          end_time: string
          id?: string
          location: string
          module_id?: string | null
          start_time: string
          teacher: string
          user_id: string
        }
        Update: {
          class_name?: string
          color?: string
          created_at?: string | null
          day?: string
          end_time?: string
          id?: string
          location?: string
          module_id?: string | null
          start_time?: string
          teacher?: string
          user_id?: string
        }
        Relationships: []
      }
      user_coins: {
        Row: {
          balance: number
          id: string
          last_updated: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          last_updated?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_daily_activity: {
        Row: {
          created_at: string | null
          date: string
          has_activity: boolean
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          has_activity?: boolean
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          has_activity?: boolean
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_module_selections: {
        Row: {
          color: string | null
          created_at: string | null
          custom_day_of_week: string | null
          custom_end_time: string | null
          custom_room: string | null
          custom_start_time: string | null
          id: string
          module_id: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          custom_day_of_week?: string | null
          custom_end_time?: string | null
          custom_room?: string | null
          custom_start_time?: string | null
          id?: string
          module_id: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          custom_day_of_week?: string | null
          custom_end_time?: string | null
          custom_room?: string | null
          custom_start_time?: string | null
          id?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_selections_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_timetable: {
        Row: {
          created_at: string
          custom_room: string | null
          custom_time: string | null
          id: string
          module_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_room?: string | null
          custom_time?: string | null
          id?: string
          module_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_room?: string | null
          custom_time?: string | null
          id?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_timetable_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      recent_schema_changes: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string | null
          object_name: string | null
          object_type: string | null
          operation: string | null
          schema_name: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string | null
          object_name?: string | null
          object_type?: string | null
          operation?: string | null
          schema_name?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string | null
          object_name?: string | null
          object_type?: string | null
          operation?: string | null
          schema_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      compare_schema_with_snapshot: {
        Args: {
          snapshot_id: string
        }
        Returns: {
          change_type: string
          object_type: string
          object_name: string
          details: Json
        }[]
      }
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_foreign_keys: {
        Args: Record<PropertyKey, never>
        Returns: {
          constraint_name: string
          table_name: string
          column_name: string
          foreign_table_name: string
          foreign_column_name: string
        }[]
      }
      get_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          index_name: string
          index_def: string
        }[]
      }
      get_schema_changes_since: {
        Args: {
          since_date: string
        }
        Returns: {
          id: string
          operation: string
          schema_name: string
          object_name: string
          object_type: string
          changed_by: string
          changed_at: string
        }[]
      }
      get_table_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          column_name: string
          data_type: string
          is_nullable: string
          column_default: string
        }[]
      }
      get_user_streak: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      increment_user_coins: {
        Args: {
          p_user_id: string
          p_amount: number
        }
        Returns: number
      }
      log_schema_change: {
        Args: {
          operation: string
          schema_name: string
          object_name: string
          object_type: string
          changed_by?: string
        }
        Returns: string
      }
      snapshot_current_schema: {
        Args: {
          description?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
