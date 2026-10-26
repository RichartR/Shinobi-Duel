-- ====================================================================
-- SHINOBI DUEL - SCHEMA EVOLUTION: SLUG KEYS, BANNERS, PROFILES & PVP
-- ====================================================================

-- 1. Profiles Table Evolution
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pity_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unlocked_figure_ids TEXT[] NOT NULL DEFAULT ARRAY['naruto_genin', 'sasuke_genin', 'sakura_genin']::TEXT[],
  ADD COLUMN IF NOT EXISTS selected_team_ids TEXT[] NOT NULL DEFAULT ARRAY['naruto_genin', 'sasuke_genin', 'sakura_genin']::TEXT[];

-- 2. Shinobi Figures Table Evolution (Slug Keys, Character Groups, Starter Flags)
ALTER TABLE public.shinobi_figures
  ADD COLUMN IF NOT EXISTS character_id VARCHAR(64),
  ADD COLUMN IF NOT EXISTS is_starter BOOLEAN DEFAULT false;

UPDATE public.shinobi_figures SET key = 'naruto_genin', character_id = 'naruto', rarity = 'C', is_starter = true WHERE key = 'naruto';
UPDATE public.shinobi_figures SET key = 'sasuke_genin', character_id = 'sasuke', rarity = 'R', is_starter = true WHERE key = 'sasuke';
UPDATE public.shinobi_figures SET key = 'sakura_genin', character_id = 'sakura', rarity = 'C', is_starter = true WHERE key = 'sakura';
UPDATE public.shinobi_figures SET key = 'shikamaru_genin', character_id = 'shikamaru', rarity = 'R', is_starter = false WHERE key = 'shikamaru';
UPDATE public.shinobi_figures SET key = 'choji_genin', character_id = 'choji', rarity = 'C', is_starter = false WHERE key = 'choji';
UPDATE public.shinobi_figures SET key = 'ino_genin', character_id = 'ino', rarity = 'C', is_starter = false WHERE key = 'ino';
UPDATE public.shinobi_figures SET key = 'hinata_genin', character_id = 'hinata', rarity = 'UC', is_starter = false WHERE key = 'hinata';
UPDATE public.shinobi_figures SET key = 'kiba_genin', character_id = 'kiba', rarity = 'UC', is_starter = false WHERE key = 'kiba';
UPDATE public.shinobi_figures SET key = 'shino_genin', character_id = 'shino', rarity = 'UC', is_starter = false WHERE key = 'shino';
UPDATE public.shinobi_figures SET key = 'lee_genin', character_id = 'lee', rarity = 'R', is_starter = false WHERE key = 'lee';

-- 3. Gacha Banners Evolution (Arco 1, 2, 3, Single/Multi Costs, Rates JSONB, Pools)
ALTER TABLE public.gacha_banners
  ADD COLUMN IF NOT EXISTS cost_single INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS cost_multi INTEGER NOT NULL DEFAULT 450,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS jp_title VARCHAR(150),
  ADD COLUMN IF NOT EXISTS pool_figure_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS rate_up_figure_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS badge_bg VARCHAR(100) DEFAULT 'bg-black text-[#FA9427]',
  ADD COLUMN IF NOT EXISTS accent_color VARCHAR(30) DEFAULT '#FA9427',
  ADD COLUMN IF NOT EXISTS rates JSONB NOT NULL DEFAULT '{"UX": 1.5, "EX": 12.0, "R": 21.5, "UC": 25.0, "C": 40.0}'::JSONB;

UPDATE public.gacha_banners
SET
  key = 'arc1_novatos_konoha',
  title = 'Pergamino I: Los Novatos de Konoha',
  subtitle = 'Elenco inicial del 1er Arco. Los 10 ninjas recién graduados de la Academia cuando eran niños.',
  jp_title = '巻之一 • 木ノ葉のルーキー (初編)',
  cost_single = 50,
  cost_multi = 450,
  pity_threshold = 40,
  pool_figure_ids = ARRAY['naruto_genin', 'sasuke_genin', 'sakura_genin', 'shikamaru_genin', 'choji_genin', 'ino_genin', 'hinata_genin', 'kiba_genin', 'shino_genin', 'lee_genin'],
  rate_up_figure_ids = ARRAY['shikamaru_genin', 'choji_genin', 'lee_genin', 'hinata_genin'],
  badge_bg = 'bg-black text-[#FA9427]',
  accent_color = '#FA9427',
  rates = '{"UX": 1.5, "EX": 12.0, "R": 21.5, "UC": 25.0, "C": 40.0}'::JSONB,
  is_active = true
WHERE key = 'standard_ninja_summon' OR key = 'arc1_novatos_konoha';

UPDATE public.gacha_banners
SET
  key = 'arc2_chunin_exam',
  title = 'Pergamino II: Examen Chūnin',
  subtitle = 'Próximamente. Presentando a Gaara, Neji, Temari, Kankuro y Orochimaru.',
  jp_title = '巻之二 • 中忍選抜試験 (砂と音)',
  cost_single = 50,
  cost_multi = 450,
  pity_threshold = 40,
  pool_figure_ids = ARRAY[]::TEXT[],
  rate_up_figure_ids = ARRAY[]::TEXT[],
  badge_bg = 'bg-stone-900 text-stone-300',
  accent_color = '#78716c',
  rates = '{"UX": 1.5, "EX": 12.0, "R": 21.5, "UC": 25.0, "C": 40.0}'::JSONB,
  is_active = false
WHERE key = 'hokage_legends' OR key = 'arc2_chunin_exam';

UPDATE public.gacha_banners
SET
  key = 'arc3_sannin_clash',
  title = 'Pergamino III: Choque de Sannin',
  subtitle = 'Próximamente. Los Legendarios Sannin: Jiraiya, Tsunade e Invocaciones Mayores.',
  jp_title = '巻之三 • 伝説の三忍激闘',
  cost_single = 60,
  cost_multi = 500,
  pity_threshold = 40,
  pool_figure_ids = ARRAY[]::TEXT[],
  rate_up_figure_ids = ARRAY[]::TEXT[],
  badge_bg = 'bg-stone-900 text-stone-300',
  accent_color = '#78716c',
  rates = '{"UX": 2.0, "EX": 13.0, "R": 25.0, "UC": 30.0, "C": 30.0}'::JSONB,
  is_active = false
WHERE key = 'akatsuki_rising' OR key = 'arc3_sannin_clash';

-- 4. User Figures Forge Support (Figure Key Slug)
ALTER TABLE public.user_figures
  ADD COLUMN IF NOT EXISTS figure_key VARCHAR(64) REFERENCES public.shinobi_figures(key) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_figures_user_figure_key 
  ON public.user_figures(user_id, figure_key);

-- 5. Multiplayer Game Rooms Table (Realtime PvP)
CREATE TABLE IF NOT EXISTS public.game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(10) UNIQUE NOT NULL,
  player1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  player1_roster JSONB,
  player2_roster JSONB,
  board_theme VARCHAR(64) NOT NULL DEFAULT 'konoha_chunin',
  status VARCHAR(30) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'finished', 'cancelled')),
  current_turn_player INTEGER NOT NULL DEFAULT 1 CHECK (current_turn_player IN (1, 2)),
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;

-- 7. High-Performance Secondary Indexes
CREATE INDEX IF NOT EXISTS idx_shinobi_figures_character_id ON public.shinobi_figures(character_id);
CREATE INDEX IF NOT EXISTS idx_shinobi_figures_rarity ON public.shinobi_figures(rarity);
CREATE INDEX IF NOT EXISTS idx_gacha_banners_is_active ON public.gacha_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON public.game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON public.game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_players ON public.game_rooms(player1_id, player2_id);

-- 8. Row Level Security Policies
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Users can create own profile" 
  ON public.profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own figures" 
  ON public.user_figures FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own figures" 
  ON public.user_figures FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own figures" 
  ON public.user_figures FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own gacha pulls" 
  ON public.gacha_pulls FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gacha pulls" 
  ON public.gacha_pulls FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Game rooms are viewable by everyone" 
  ON public.game_rooms FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Players can create game rooms" 
  ON public.game_rooms FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Players can update game rooms" 
  ON public.game_rooms FOR UPDATE 
  TO public 
  USING (true);
