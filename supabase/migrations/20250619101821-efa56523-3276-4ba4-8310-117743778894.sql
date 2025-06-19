
-- Create categories table for sports and esports
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table for news content
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  is_breaking BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reading_time INTEGER DEFAULT 5,
  views_count INTEGER DEFAULT 0
);

-- Create bookmarks table for user favorites
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Categories and articles are public (read-only for everyone)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Articles are viewable by everyone" ON public.articles FOR SELECT USING (true);

-- Bookmarks policies for authenticated users
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Insert sample categories
INSERT INTO public.categories (name, slug, icon, color) VALUES
('Football', 'football', '⚽', '#16A34A'),
('Basketball', 'basketball', '🏀', '#EA580C'),
('Tennis', 'tennis', '🎾', '#7C3AED'),
('Baseball', 'baseball', '⚾', '#DC2626'),
('Soccer', 'soccer', '⚽', '#059669'),
('League of Legends', 'league-of-legends', '🎮', '#3B82F6'),
('CS:GO', 'csgo', '🔫', '#EF4444'),
('Valorant', 'valorant', '🎯', '#F59E0B'),
('Dota 2', 'dota2', '⚔️', '#8B5CF6'),
('Overwatch', 'overwatch', '🛡️', '#F97316');

-- Insert sample articles
INSERT INTO public.articles (title, slug, excerpt, content, author, category_id, is_breaking, is_featured, reading_time, image_url) VALUES
('Champions League Final Set for Epic Showdown', 'champions-league-final-epic-showdown', 'Two powerhouse teams prepare for the most anticipated match of the season with millions watching worldwide.', 'The stage is set for what promises to be one of the most thrilling Champions League finals in recent memory. Both teams have shown exceptional form throughout the tournament, with record-breaking performances and stunning displays of skill. The final will take place at a packed stadium with an estimated global audience of over 400 million viewers. Team preparations have been intense, with both sides focusing on tactical adjustments and player fitness. The match is expected to be a tactical masterpiece, featuring some of the world''s best players at the peak of their abilities. Historical rivalries and previous encounters add an extra layer of excitement to this already captivating fixture.', 'Sarah Martinez', (SELECT id FROM public.categories WHERE slug = 'soccer'), true, true, 4, 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop'),

('NBA Draft Lottery Delivers Shocking Results', 'nba-draft-lottery-shocking-results', 'Unexpected team movements shake up the draft order ahead of the summer''s biggest basketball event.', 'The annual NBA Draft Lottery produced some of the most surprising results in recent years, completely reshuffling the expected draft order. Several teams moved up significantly from their projected positions, while others fell further than anticipated. The lottery results will have major implications for franchise futures and player destinations. Front office executives are already working around the clock to adjust their draft strategies and explore potential trade opportunities. This year''s draft class is considered one of the strongest in recent memory, making the lottery results even more significant for team building. The unexpected outcomes have created new possibilities and changed the landscape of summer trade discussions.', 'Michael Johnson', (SELECT id FROM public.categories WHERE slug = 'basketball'), false, true, 3, 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'),

('Wimbledon Sees Historic Upset in Quarter-Finals', 'wimbledon-historic-upset-quarter-finals', 'Unseeded player defeats former world number one in straight sets to reach semi-finals for the first time.', 'In one of the biggest upsets in Wimbledon history, an unseeded player has defeated a former world number one in straight sets to advance to the semi-finals. The match was played in front of a stunned Centre Court crowd who witnessed tennis history in the making. The victory marks the player''s first Grand Slam semi-final appearance and represents years of hard work and dedication paying off on the sport''s biggest stage. The winner showed incredible composure and tactical awareness throughout the match, executing a perfect game plan against one of tennis''s most accomplished champions. This breakthrough performance has captivated tennis fans worldwide and established a new star in the sport.', 'Emma Thompson', (SELECT id FROM public.categories WHERE slug = 'tennis'), false, false, 5, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop'),

('League of Legends World Championship Finals Preview', 'lol-worlds-championship-finals-preview', 'Two dominant teams clash in the ultimate eSports showdown with a massive prize pool and global audience.', 'The League of Legends World Championship finals promises to be the biggest eSports event of the year, featuring two teams that have dominated their respective regions throughout the season. The match will be held in a sold-out arena with millions more watching online from around the globe. Both teams have shown incredible strategic depth and mechanical skill in their journey to the finals. The prize pool exceeds previous records, and the winning team will claim not only financial rewards but also the prestigious Summoner''s Cup. Team compositions and strategic adaptations will be crucial in this best-of-five series. The finals represent the pinnacle of competitive League of Legends and showcase the highest level of eSports competition.', 'Alex Chen', (SELECT id FROM public.categories WHERE slug = 'league-of-legends'), true, true, 6, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'),

('CS:GO Major Tournament Delivers Incredible Plays', 'csgo-major-tournament-incredible-plays', 'Professional players showcase extraordinary skill and teamwork in high-stakes competitive matches.', 'The latest CS:GO Major tournament has been filled with incredible individual plays and team strategies that have left fans and analysts amazed. Several matches have gone to overtime, featuring clutch situations and remarkable comeback victories. The level of competition has been exceptionally high, with teams pushing the boundaries of tactical gameplay and individual skill expression. Prize money and ranking points are on the line as teams battle through the group stages toward the playoffs. Viewership numbers have broken previous records, demonstrating the continued growth and popularity of competitive Counter-Strike. The tournament format has created maximum excitement with every match carrying significant implications for team advancement.', 'David Kim', (SELECT id FROM public.categories WHERE slug = 'csgo'), false, false, 4, 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'),

('Baseball Season Enters Critical Final Stretch', 'baseball-season-critical-final-stretch', 'Playoff races heat up as teams make final pushes for postseason berths with just weeks remaining.', 'As the baseball season enters its final weeks, multiple playoff races are still undecided with teams fighting for crucial postseason positions. Several franchises have made significant trades and roster moves to strengthen their chances of making the playoffs. The wild card races in both leagues remain extremely competitive, with just a few games separating multiple teams. Individual player performances have been outstanding, with several athletes in contention for major awards and statistical milestones. Fan attendance and television ratings have increased as the excitement builds toward October baseball. Management decisions and player health will be critical factors in determining which teams advance to the postseason.', 'Rachel Williams', (SELECT id FROM public.categories WHERE slug = 'baseball'), false, true, 3, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'),

('Valorant Champions Tour Finals Breaks Records', 'valorant-champions-tour-finals-breaks-records', 'The tactical shooter''s biggest tournament achieves new viewership milestones and showcases elite competition.', 'The Valorant Champions Tour finals have shattered previous viewership records, establishing new benchmarks for the tactical shooter eSports scene. Teams from around the world have competed in a format that emphasizes both individual skill and team coordination. The matches have featured innovative strategies and agent compositions that have influenced the broader competitive meta. Production values have reached new heights with advanced broadcast technology and expert commentary teams. The prize distribution and team support systems have set new standards for player welfare in eSports competitions. This tournament has solidified Valorant''s position as a premier competitive title in the FPS genre.', 'Jordan Lee', (SELECT id FROM public.categories WHERE slug = 'valorant'), false, false, 5, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop'),

('Football Transfer Window Creates Major Shakeups', 'football-transfer-window-major-shakeups', 'High-profile player movements reshape team dynamics ahead of the upcoming season.', 'The summer transfer window has produced some of the most significant player movements in recent football history, with several world-class athletes changing clubs in record-breaking deals. These transfers have reshaped the competitive landscape and created new rivalries and storylines for the upcoming season. Club strategies have evolved to balance financial fair play regulations with the desire to acquire top talent. Fan reactions have been mixed, with excitement about new signings balanced against concerns about player loyalty and club identity. The economic impact of these transfers extends beyond the clubs involved, affecting merchandise sales, sponsorship deals, and global marketing opportunities. Coaching staffs are adapting their tactical approaches to accommodate new star players and team compositions.', 'Maria Rodriguez', (SELECT id FROM public.categories WHERE slug = 'football'), true, false, 4, 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop');

-- Create indexes for better performance
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX idx_articles_breaking ON public.articles(is_breaking) WHERE is_breaking = true;
CREATE INDEX idx_articles_featured ON public.articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
