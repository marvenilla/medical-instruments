import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://srkouriqbasmxhftuqxr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNya291cmlxYmFzbXhoZnR1cXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyMTg3NTEsImV4cCI6MjAzNjc5NDc1MX0.ixidrK-EEkDPOXa8ew1_nyAffiAmvxSITviBacLub7E'
export const supabase = createClient(supabaseUrl, supabaseKey)