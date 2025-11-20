-- ==================== 玩家核心表 ====================

CREATE TABLE IF NOT EXISTS public.players (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- 基础信息
  name TEXT NOT NULL,
  avatar TEXT,
  
  -- 修为信息
  rank TEXT NOT NULL DEFAULT 'MORTAL',
  sect_rank TEXT NOT NULL DEFAULT 'OUTER',
  level INTEGER NOT NULL DEFAULT 1,
  qi NUMERIC NOT NULL DEFAULT 0,
  max_qi NUMERIC NOT NULL DEFAULT 100,
  
  -- 资质与心性
  spirit_root TEXT NOT NULL DEFAULT 'WASTE',
  mind_state TEXT NOT NULL DEFAULT '刚入职',
  
  -- 资源
  inner_demon NUMERIC NOT NULL DEFAULT 0,
  contribution INTEGER NOT NULL DEFAULT 0,
  spirit_stones INTEGER NOT NULL DEFAULT 0,
  cave_level INTEGER NOT NULL DEFAULT 1,
  
  -- JSON字段
  inventory JSONB NOT NULL DEFAULT '{}',
  equipped JSONB NOT NULL DEFAULT '{}',
  materials JSONB NOT NULL DEFAULT '{}',
  history JSONB NOT NULL DEFAULT '[]',
  
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_rank_level ON players(rank, level);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);

-- ==================== 宗门系统 ====================

CREATE TABLE IF NOT EXISTS public.sects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  reputation INTEGER NOT NULL DEFAULT 0,
  leader_id BIGINT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sect_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id BIGINT REFERENCES players(id) ON DELETE CASCADE UNIQUE NOT NULL,
  sect_id UUID REFERENCES sects(id) ON DELETE CASCADE NOT NULL,
  rank TEXT NOT NULL DEFAULT 'OUTER',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sect_members_sect ON sect_members(sect_id);

-- ==================== 任务系统 ====================

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id BIGINT REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'EASY',
  category TEXT NOT NULL DEFAULT 'DAILY',
  
  -- 奖励
  reward_qi INTEGER NOT NULL,
  reward_contribution INTEGER NOT NULL,
  reward_stones INTEGER NOT NULL,
  
  duration INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  
  url TEXT,
  quiz JSONB,
  enemy JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_player_status ON tasks(player_id, status);

-- ==================== 排行榜系统 ====================

CREATE TABLE IF NOT EXISTS public.seasons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id BIGINT REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  season_id TEXT REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  
  player_name TEXT NOT NULL,
  player_avatar TEXT,
  rank TEXT NOT NULL,
  level INTEGER NOT NULL,
  
  -- 分数
  realm_score BIGINT NOT NULL DEFAULT 0,
  power_score BIGINT NOT NULL DEFAULT 0,
  wealth_score BIGINT NOT NULL DEFAULT 0,
  contribution_score BIGINT NOT NULL DEFAULT 0,
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(player_id, season_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_season_realm ON leaderboard(season_id, realm_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_season_power ON leaderboard(season_id, power_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_season_wealth ON leaderboard(season_id, wealth_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_season_contribution ON leaderboard(season_id, contribution_score DESC);

-- ==================== 事件系统 ====================

CREATE TABLE IF NOT EXISTS public.event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id BIGINT REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  choice_id TEXT,
  choice_text TEXT,
  result JSONB NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_logs_player_created ON event_logs(player_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.player_status_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id BIGINT REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  
  effect_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  modifiers JSONB NOT NULL,
  
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  UNIQUE(player_id, effect_id)
);

CREATE INDEX IF NOT EXISTS idx_status_effects_player_expires ON player_status_effects(player_id, expires_at);

-- ==================== Row Level Security ====================

-- 启用 RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_status_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE sects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sect_members ENABLE ROW LEVEL SECURITY;

-- 玩家表策略
CREATE POLICY "玩家只能查看自己的数据"
  ON players FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "玩家只能更新自己的数据"
  ON players FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "新用户可以创建玩家角色"
  ON players FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 任务表策略
CREATE POLICY "玩家只能查看自己的任务"
  ON tasks FOR SELECT
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "玩家只能修改自己的任务"
  ON tasks FOR UPDATE
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "玩家可以创建自己的任务"
  ON tasks FOR INSERT
  WITH CHECK (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "玩家可以删除自己的任务"
  ON tasks FOR DELETE
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- 事件日志策略
CREATE POLICY "玩家只能查看自己的事件"
  ON event_logs FOR SELECT
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "玩家可以创建自己的事件"
  ON event_logs FOR INSERT
  WITH CHECK (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- 状态效果策略
CREATE POLICY "玩家只能查看自己的状态"
  ON player_status_effects FOR SELECT
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "玩家可以管理自己的状态"
  ON player_status_effects FOR ALL
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- 排行榜策略(所有人可读)
CREATE POLICY "所有人可以查看排行榜"
  ON leaderboard FOR SELECT
  USING (true);

-- 宗门表策略(所有人可读)
CREATE POLICY "所有人可以查看宗门信息"
  ON sects FOR SELECT
  USING (true);

CREATE POLICY "所有人可以查看宗门成员"
  ON sect_members FOR SELECT
  USING (true);

-- ==================== 辅助函数 ====================

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sects_updated_at
  BEFORE UPDATE ON sects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 完成任务的事务函数
CREATE OR REPLACE FUNCTION complete_task(
  p_task_id UUID,
  p_player_id BIGINT,
  p_reward_qi INTEGER,
  p_reward_contribution INTEGER,
  p_reward_stones INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_player JSONB;
  v_task JSONB;
BEGIN
  -- 更新玩家
  UPDATE players
  SET 
    qi = qi + p_reward_qi,
    contribution = contribution + p_reward_contribution,
    spirit_stones = spirit_stones + p_reward_stones,
    updated_at = NOW()
  WHERE id = p_player_id
  RETURNING to_jsonb(players.*) INTO v_player;
  
  -- 更新任务
  UPDATE tasks
  SET 
    status = 'COMPLETED',
    completed_at = NOW()
  WHERE id = p_task_id
  RETURNING to_jsonb(tasks.*) INTO v_task;
  
  RETURN jsonb_build_object(
    'player', v_player,
    'task', v_task
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;