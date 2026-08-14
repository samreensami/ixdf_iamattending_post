import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback defaults to prevent build/runtime errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';

// Supabase Client Initialization
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { name, designation, createdAt } = await req.json();

    // Insert row into Supabase 'attendees' table
    const { data, error } = await supabase
      .from('attendees')
      .insert([
        {
          name: name,
          designation: designation,
          created_at: createdAt,
        },
      ]);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: 'Saved successfully', data });
  } catch (err) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}