import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("Error: VITE_SUPABASE_URL is not defined. Make sure to set it in your .env file.")
}

if (!supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_ANON_KEY is not defined. Make sure to set it in your .env file.")
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

if (!supabase) {
  console.error("Supabase client could not be initialized. Please check your environment variables.")
}
