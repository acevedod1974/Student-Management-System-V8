import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ppcmxkdoxdaroveggkfr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwY214a2RveGRhcm92ZWdna2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMjcwNjcsImV4cCI6MjA0OTkwMzA2N30.RV0wVWkdE_CUYliTYeGyLavyB3H-2WPM_7xz8GGjMQY";
export const supabase = createClient(supabaseUrl, supabaseKey);
