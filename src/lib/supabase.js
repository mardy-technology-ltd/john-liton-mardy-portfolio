import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = rawSupabaseUrl ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '') : '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));
}

// Client-side Supabase instance
let browserClient = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient && typeof window !== 'undefined') {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// Server-side Supabase instance (uses Service Role Key if available, else Anon Key)
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Fetch full CMS configuration from Supabase
 */
export async function fetchCMSDataFromDB() {
  try {
    const supabase = getSupabaseServerClient() || getSupabaseBrowserClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('portfolio_cms')
      .select('content')
      .eq('id', 'global')
      .single();

    if (error || !data?.content) {
      return null;
    }

    return data.content;
  } catch (err) {
    console.error('Supabase fetch CMS error:', err);
    return null;
  }
}

/**
 * Save / Upsert CMS configuration to Supabase
 */
export async function saveCMSDataToDB(cmsPayload) {
  try {
    const supabase = getSupabaseServerClient() || getSupabaseBrowserClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('portfolio_cms')
      .upsert({
        id: 'global',
        content: cmsPayload,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase save CMS error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase save CMS exception:', err);
    return false;
  }
}

/**
 * Save incoming contact or hire inquiry to Supabase
 */
export async function saveContactMessageToDB(messageData) {
  try {
    const supabase = getSupabaseServerClient() || getSupabaseBrowserClient();
    if (!supabase) return null;

    const record = {
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || messageData.projectType || 'General Inquiry',
      message: messageData.message,
      source: messageData.source || 'contact_form',
      budget: messageData.budget || null,
      timeline: messageData.timeline || null,
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert message error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Supabase insert message exception:', err);
    return null;
  }
}
