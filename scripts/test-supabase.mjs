import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

console.log('Testing Supabase with URL:', url ? url.substring(0, 25) + '...' : 'NONE');

if (url && key) {
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('portfolio_cms').select('*');
  if (error) {
    console.error('Supabase Query Error:', error.message);
  } else {
    console.log('✓ SUPABASE CONNECTION SUCCESSFUL! Rows in portfolio_cms:', data.length);
  }

  const { data: msgData, error: msgError } = await supabase.from('contact_messages').select('*');
  if (msgError) {
    console.error('Supabase contact_messages Query Error:', msgError.message);
  } else {
    console.log('✓ SUPABASE contact_messages Table Ready! Rows found:', msgData.length);
  }
} else {
  console.log('URL or Key missing');
}
