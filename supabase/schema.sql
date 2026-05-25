-- ============================================================
-- GUIA MINHA CHAPADA — Schema do banco de dados (Supabase)
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- ============================================================

-- Tabela de perfis dos guias
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  city TEXT NOT NULL DEFAULT 'Lençóis',
  whatsapp TEXT,
  photo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de passeios
CREATE TABLE public.passeios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('trilhas', 'cachoeiras', 'canions', 'travessias')),
  price_estimate TEXT,
  difficulty TEXT CHECK (difficulty IN ('facil', 'moderado', 'dificil')),
  duration TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passeios ENABLE ROW LEVEL SECURITY;

-- Turistas podem ver todos os perfis
CREATE POLICY "perfis_leitura_publica" ON public.profiles
  FOR SELECT USING (TRUE);

-- Guias só editam o próprio perfil
CREATE POLICY "perfis_edicao_propria" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Turistas podem ver passeios ativos
CREATE POLICY "passeios_leitura_publica" ON public.passeios
  FOR SELECT USING (active = TRUE);

-- Guias gerenciam os próprios passeios
CREATE POLICY "passeios_gestao_propria" ON public.passeios
  FOR ALL USING (auth.uid() = guide_id);

-- Trigger: cria perfil automaticamente quando guia se cadastra
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS TRIGGER AS $$
DECLARE
  slug_base TEXT;
  slug_final TEXT;
  contador INT := 0;
BEGIN
  slug_base := REGEXP_REPLACE(
    LOWER(COALESCE(NEW.raw_user_meta_data->>'name', 'guia')),
    '[^a-z0-9]+', '-', 'g'
  );
  slug_base := TRIM(BOTH '-' FROM slug_base);

  IF slug_base = '' THEN
    slug_base := 'guia';
  END IF;

  slug_final := slug_base;

  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = slug_final) LOOP
    contador := contador + 1;
    slug_final := slug_base || '-' || contador;
  END LOOP;

  INSERT INTO public.profiles (id, name, slug, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Guia'),
    slug_final,
    COALESCE(NEW.raw_user_meta_data->>'city', 'Lençóis')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ao_criar_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_novo_usuario();
