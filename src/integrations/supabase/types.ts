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
      course_modules: {
        Row: {
          academic_year: number
          course_id: string | null
          created_at: string | null
          day_of_week: string
          end_time: string
          group_name: string | null
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
          created_at?: string | null
          day_of_week: string
          end_time: string
          group_name?: string | null
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
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          group_name?: string | null
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
          group_name: string | null
          id: string
          module_code: string
          module_title: string
          module_type: string
          semester: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          group_name?: string | null
          id?: string
          module_code: string
          module_title: string
          module_type: string
          semester: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          group_name?: string | null
          id?: string
          module_code?: string
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
          course_id: string | null
          created_at: string
          department: string | null
          id: string
          module_group: string | null
          semester: string | null
          student_id: string | null
          timetable_setup: boolean | null
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          course_id?: string | null
          created_at?: string
          department?: string | null
          id: string
          module_group?: string | null
          semester?: string | null
          student_id?: string | null
          timetable_setup?: boolean | null
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          course_id?: string | null
          created_at?: string
          department?: string | null
          id?: string
          module_group?: string | null
          semester?: string | null
          student_id?: string | null
          timetable_setup?: boolean | null
          updated_at?: string
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
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          module_id: string | null
          priority: string | null
          status: string
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
