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
      articles: {
        Row: {
          id: number
          titulo: string
          slug: string
          extracto: string | null
          contenido: string | null
          imagen_url: string | null
          fecha_publicacion: string
          autor: string | null
          categoria: string | null
          categoria_slug: string | null
          destacado: boolean
          tags: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          titulo: string
          slug: string
          extracto?: string | null
          contenido?: string | null
          imagen_url?: string | null
          fecha_publicacion?: string
          autor?: string | null
          categoria?: string | null
          categoria_slug?: string | null
          destacado?: boolean
          tags?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          titulo?: string
          slug?: string
          extracto?: string | null
          contenido?: string | null
          imagen_url?: string | null
          fecha_publicacion?: string
          autor?: string | null
          categoria?: string | null
          categoria_slug?: string | null
          destacado?: boolean
          tags?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          nombre: string
          slug: string
          descripcion: string | null
          created_at: string
        }
        Insert: {
          id?: number
          nombre: string
          slug: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          nombre?: string
          slug?: string
          descripcion?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          nombre: string | null
          rol: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          nombre?: string | null
          rol?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          rol?: string
          created_at?: string
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
