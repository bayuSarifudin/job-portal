import { createClient } from "@supabase/supabase-js";

const client = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.NEXT_PUBLIC_ANON_KEY as string,
);

export default client;
