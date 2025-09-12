export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number
          email: string
          password_hash: string
          name: string
          role: string
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          password_hash: string
          name: string
          role?: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          password_hash?: string
          name?: string
          role?: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: number
          name: string
          company: string | null
          email: string
          phone: string | null
          country: string | null
          subject: string | null
          message: string
          language: string
          status: string
          is_read: boolean
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          company?: string | null
          email: string
          phone?: string | null
          country?: string | null
          subject?: string | null
          message: string
          language?: string
          status?: string
          is_read?: boolean
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          company?: string | null
          email?: string
          phone?: string | null
          country?: string | null
          subject?: string | null
          message?: string
          language?: string
          status?: string
          is_read?: boolean
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      page_contents: {
        Row: {
          id: number
          page_key: string
          section_key: string
          content_zh: string | null
          content_en: string | null
          content_ru: string | null
          content_type: string
          meta_data: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          page_key: string
          section_key: string
          content_zh?: string | null
          content_en?: string | null
          content_ru?: string | null
          content_type?: string
          meta_data?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          page_key?: string
          section_key?: string
          content_zh?: string | null
          content_en?: string | null
          content_ru?: string | null
          content_type?: string
          meta_data?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          product_code: string
          name_zh: string
          name_en: string
          name_ru: string
          description_zh: string | null
          description_en: string | null
          description_ru: string | null
          specifications_zh: string | null
          specifications_en: string | null
          specifications_ru: string | null
          applications_zh: string | null
          applications_en: string | null
          applications_ru: string | null
          image_url: string | null
          features_zh: string[] | null
          features_en: string[] | null
          features_ru: string[] | null
          price_range: string | null
          packaging_options_zh: string | null
          packaging_options_en: string | null
          packaging_options_ru: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          product_code: string
          name_zh: string
          name_en: string
          name_ru: string
          description_zh?: string | null
          description_en?: string | null
          description_ru?: string | null
          specifications_zh?: string | null
          specifications_en?: string | null
          specifications_ru?: string | null
          applications_zh?: string | null
          applications_en?: string | null
          applications_ru?: string | null
          image_url?: string | null
          features_zh?: string[] | null
          features_en?: string[] | null
          features_ru?: string[] | null
          price_range?: string | null
          packaging_options_zh?: string | null
          packaging_options_en?: string | null
          packaging_options_ru?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_code?: string
          name_zh?: string
          name_en?: string
          name_ru?: string
          description_zh?: string | null
          description_en?: string | null
          description_ru?: string | null
          specifications_zh?: string | null
          specifications_en?: string | null
          specifications_ru?: string | null
          applications_zh?: string | null
          applications_en?: string | null
          applications_ru?: string | null
          image_url?: string | null
          features_zh?: string[] | null
          features_en?: string[] | null
          features_ru?: string[] | null
          price_range?: string | null
          packaging_options_zh?: string | null
          packaging_options_en?: string | null
          packaging_options_ru?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: number
          setting_key: string
          setting_value_zh: string | null
          setting_value_en: string | null
          setting_value_ru: string | null
          setting_type: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          setting_key: string
          setting_value_zh?: string | null
          setting_value_en?: string | null
          setting_value_ru?: string | null
          setting_type?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          setting_key?: string
          setting_value_zh?: string | null
          setting_value_en?: string | null
          setting_value_ru?: string | null
          setting_type?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
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
