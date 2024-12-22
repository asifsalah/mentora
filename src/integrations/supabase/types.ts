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
      course_categories: {
        Row: {
          category_name: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          parent_id: string | null
          status: Database["public"]["Enums"]["category_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_name: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_name?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          enrolled_at: string
          enrollment_id: string
          progress: number
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          enrollment_id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          enrollment_id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
        ]
      }
      courses: {
        Row: {
          category_ids: string[] | null
          course_id: string
          created_at: string
          description: string | null
          feature_image: string | null
          instructor_id: string
          promo_video_url: string | null
          regular_price: number | null
          sale_price: number | null
          short_description: string | null
          status: Database["public"]["Enums"]["course_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_ids?: string[] | null
          course_id?: string
          created_at?: string
          description?: string | null
          feature_image?: string | null
          instructor_id: string
          promo_video_url?: string | null
          regular_price?: number | null
          sale_price?: number | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_ids?: string[] | null
          course_id?: string
          created_at?: string
          description?: string | null
          feature_image?: string | null
          instructor_id?: string
          promo_video_url?: string | null
          regular_price?: number | null
          sale_price?: number | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_materials: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: Database["public"]["Enums"]["material_type"]
          file_url: string
          lesson_id: string
          material_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: Database["public"]["Enums"]["material_type"]
          file_url: string
          lesson_id: string
          material_id?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: Database["public"]["Enums"]["material_type"]
          file_url?: string
          lesson_id?: string
          material_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["lesson_id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          lesson_id: string
          parent_lesson_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["lesson_status"]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          lesson_id?: string
          parent_lesson_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["lesson_status"]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          lesson_id?: string
          parent_lesson_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["lesson_status"]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "lessons_parent_lesson_id_fkey"
            columns: ["parent_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["lesson_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          mobile_number: string | null
          profile_picture_url: string | null
          roles: string[] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          mobile_number?: string | null
          profile_picture_url?: string | null
          roles?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          mobile_number?: string | null
          profile_picture_url?: string | null
          roles?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answer_id: string
          attempt_id: string
          created_at: string
          is_correct: boolean
          points_earned: number
          question_id: string
          selected_options: string[]
          updated_at: string
        }
        Insert: {
          answer_id?: string
          attempt_id: string
          created_at?: string
          is_correct?: boolean
          points_earned?: number
          question_id: string
          selected_options?: string[]
          updated_at?: string
        }
        Update: {
          answer_id?: string
          attempt_id?: string
          created_at?: string
          is_correct?: boolean
          points_earned?: number
          question_id?: string
          selected_options?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["attempt_id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_id: string
          attempt_number: number
          created_at: string
          end_time: string | null
          passed: boolean | null
          quiz_id: string
          score: number | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_id?: string
          attempt_number: number
          created_at?: string
          end_time?: string | null
          passed?: boolean | null
          quiz_id: string
          score?: number | null
          start_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          attempt_number?: number
          created_at?: string
          end_time?: string | null
          passed?: boolean | null
          quiz_id?: string
          score?: number | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      quiz_options: {
        Row: {
          created_at: string
          is_correct: boolean
          option_id: string
          option_text: string
          question_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_correct?: boolean
          option_id?: string
          option_text: string
          question_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_correct?: boolean
          option_id?: string
          option_text?: string
          question_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          explanation: string | null
          is_multiple_correct: boolean
          points: number
          question_id: string
          question_text: string
          quiz_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          is_multiple_correct?: boolean
          points?: number
          question_id?: string
          question_text: string
          quiz_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          explanation?: string | null
          is_multiple_correct?: boolean
          points?: number
          question_id?: string
          question_text?: string
          quiz_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      quizzes: {
        Row: {
          availability: Database["public"]["Enums"]["quiz_availability"]
          course_id: string
          created_at: string
          description: string | null
          lesson_id: string | null
          max_attempts: number
          passing_score: number
          quiz_id: string
          result_date: string | null
          result_visibility: Database["public"]["Enums"]["result_visibility"]
          status: Database["public"]["Enums"]["quiz_status"]
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          availability: Database["public"]["Enums"]["quiz_availability"]
          course_id: string
          created_at?: string
          description?: string | null
          lesson_id?: string | null
          max_attempts?: number
          passing_score?: number
          quiz_id?: string
          result_date?: string | null
          result_visibility?: Database["public"]["Enums"]["result_visibility"]
          status?: Database["public"]["Enums"]["quiz_status"]
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          availability?: Database["public"]["Enums"]["quiz_availability"]
          course_id?: string
          created_at?: string
          description?: string | null
          lesson_id?: string | null
          max_attempts?: number
          passing_score?: number
          quiz_id?: string
          result_date?: string | null
          result_visibility?: Database["public"]["Enums"]["result_visibility"]
          status?: Database["public"]["Enums"]["quiz_status"]
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["lesson_id"]
          },
        ]
      }
      user_role: {
        Row: {
          created_at: string
          parent_role_id: string | null
          role_id: string
          role_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          parent_role_id?: string | null
          role_id?: string
          role_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          parent_role_id?: string | null
          role_id?: string
          role_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_attempt_quiz: {
        Args: {
          quiz_id: string
          user_id: string
        }
        Returns: boolean
      }
      get_category_hierarchy: {
        Args: {
          category_id: string
        }
        Returns: {
          id: string
          category_name: string
          parent_id: string
          level: number
        }[]
      }
    }
    Enums: {
      category_status: "active" | "inactive" | "pending" | "archived"
      course_status: "draft" | "published" | "pending" | "inactive"
      enrollment_status: "active" | "completed" | "dropped" | "expired"
      lesson_status: "draft" | "published" | "archived"
      material_type: "image" | "pdf" | "word" | "excel" | "other"
      quiz_availability: "after_lesson" | "after_course"
      quiz_status: "draft" | "published" | "archived"
      result_visibility: "immediate" | "specific_date"
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
