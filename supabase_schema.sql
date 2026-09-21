-- ================================================================
-- JOHN LITON MARDY PORTFOLIO - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ================================================================

-- 1. Table: portfolio_cms (Stores global CMS customization state)
CREATE TABLE IF NOT EXISTS public.portfolio_cms (
    id TEXT PRIMARY KEY DEFAULT 'global',
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: contact_messages (Stores incoming client leads and hire inquiries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'contact_form', -- 'contact_form' | 'hire_modal'
    budget TEXT,
    timeline TEXT,
    status TEXT DEFAULT 'unread', -- 'unread' | 'read' | 'replied' | 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS
ALTER TABLE public.portfolio_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Portfolio CMS: Allow public read so all visitors see the latest content
DROP POLICY IF EXISTS "Public can view portfolio_cms" ON public.portfolio_cms;
CREATE POLICY "Public can view portfolio_cms"
ON public.portfolio_cms FOR SELECT
TO anon, authenticated
USING (true);

-- Portfolio CMS: Allow authenticated or anon upsert (managed via Server/API)
DROP POLICY IF EXISTS "Service or API can update portfolio_cms" ON public.portfolio_cms;
CREATE POLICY "Service or API can update portfolio_cms"
ON public.portfolio_cms FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Contact Messages: Allow public insert so visitors can send messages
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Contact Messages: Allow viewing messages
DROP POLICY IF EXISTS "Allow select contact messages" ON public.contact_messages;
CREATE POLICY "Allow select contact messages"
ON public.contact_messages FOR SELECT
TO anon, authenticated
USING (true);

-- Contact Messages: Allow update status (read/unread)
DROP POLICY IF EXISTS "Allow update contact messages" ON public.contact_messages;
CREATE POLICY "Allow update contact messages"
ON public.contact_messages FOR UPDATE
TO anon, authenticated
USING (true);

-- Contact Messages: Allow delete
DROP POLICY IF EXISTS "Allow delete contact messages" ON public.contact_messages;
CREATE POLICY "Allow delete contact messages"
ON public.contact_messages FOR DELETE
TO anon, authenticated
USING (true);

-- Enable Realtime for portfolio_cms and contact_messages (Optional for instant live sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_cms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
