import { createClient } from '@supabase/supabase-js'
import { strict as assert } from 'node:assert'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

assert(supabaseUrl !== undefined, 'Supabase URL is required')
assert(supabaseAnonKey !== undefined, 'Supabase anon key is required')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
