-- ============================================================
-- ADMIN SETUP — Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Adiciona coluna de role na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'guide'
CHECK (role IN ('guide', 'admin'));

-- 2. Torna você admin — substitua pelo seu user ID
--    (encontre em: Supabase → Authentication → Users → copie o UUID)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'cole-seu-uuid-aqui';
