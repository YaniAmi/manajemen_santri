import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabase;
}

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://hcedinakxosvxtxlnbqh.supabase.co";
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// export default supabase;
