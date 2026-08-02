-- CampusFind Production PostgreSQL Database Schema & RLS Policies
-- Compatible with Supabase PostgreSQL Engine

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE item_type_enum AS ENUM ('LOST', 'FOUND');
CREATE TYPE item_status_enum AS ENUM ('OPEN', 'CLAIMED', 'RESOLVED', 'ARCHIVED');
CREATE TYPE claim_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'INFO_REQUESTED');
CREATE TYPE report_reason_enum AS ENUM ('SPAM', 'FAKE_LISTING', 'OFFENSIVE', 'DUPLICATE', 'WRONG_CATEGORY', 'OTHER');
CREATE TYPE user_role_enum AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');

-- 2. CAMPUSES TABLE
CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'India',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUILDINGS TABLE
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    floors INTEGER DEFAULT 4,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role_enum DEFAULT 'STUDENT',
    department TEXT,
    year_of_study INTEGER,
    student_id TEXT,
    whatsapp_number TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    reputation_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type item_type_enum NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT,
    primary_color TEXT,
    building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
    floor_number INTEGER,
    specific_location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    date_occurred DATE NOT NULL,
    time_occurred TIME,
    reward_amount NUMERIC(10, 2) DEFAULT 0,
    contact_whatsapp TEXT,
    additional_contact TEXT,
    tags TEXT[] DEFAULT '{}',
    status item_status_enum DEFAULT 'OPEN',
    ai_confidence_score DOUBLE PRECISION,
    ocr_extracted_text TEXT,
    qr_code_data TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ITEM IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.item_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    ai_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status claim_status_enum DEFAULT 'PENDING',
    reason TEXT NOT NULL,
    identifying_details TEXT NOT NULL,
    proof_image_url TEXT,
    contact_number TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CLAIM MESSAGES TABLE (Realtime Chat)
CREATE TABLE IF NOT EXISTS public.claim_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'CLAIM', 'MESSAGE', 'MATCH', 'SYSTEM'
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 12. REPORTS TABLE (Safety & Moderation)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    reason report_reason_enum NOT NULL,
    details TEXT,
    is_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'NORMAL', -- 'NORMAL', 'URGENT', 'EVENT'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BADGES & USER POINTS TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    min_points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(user_id, badge_id)
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, user can update own profile
CREATE POLICY "Public profiles read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Items: Anyone can read items, authenticated users can insert/update own items
CREATE POLICY "Public items read access" ON public.items FOR SELECT USING (true);
CREATE POLICY "Users insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own items" ON public.items FOR UPDATE USING (auth.uid() = user_id);

-- Claims: Claimant and Owner can read and update claim
CREATE POLICY "Claim participants read access" ON public.claims FOR SELECT USING (auth.uid() = claimant_id OR auth.uid() = owner_id);
CREATE POLICY "Users insert claims" ON public.claims FOR INSERT WITH CHECK (auth.uid() = claimant_id);
CREATE POLICY "Claim participants update claims" ON public.claims FOR UPDATE USING (auth.uid() = claimant_id OR auth.uid() = owner_id);

-- Claim Messages: Participants only
CREATE POLICY "Claim message participants read" ON public.claim_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.claims 
        WHERE claims.id = claim_messages.claim_id 
        AND (claims.claimant_id = auth.uid() OR claims.owner_id = auth.uid())
    )
);
CREATE POLICY "Claim message insert" ON public.claim_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Bookmarks: User only
CREATE POLICY "User bookmark access" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Notifications: User only
CREATE POLICY "User notification access" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- SEED DATA SETUP
INSERT INTO public.categories (name, icon, description) VALUES
('Electronics', 'Smartphone', 'Phones, laptops, chargers, headphones'),
('Wallets & Purses', 'Wallet', 'Leather wallets, coin purses, card holders'),
('ID Cards & Docs', 'CreditCard', 'Student IDs, driver licenses, passports'),
('Keys', 'Key', 'Room keys, bike keys, car key fobs'),
('Bags & Backpacks', 'Backpack', 'School backpacks, gym bags, totes'),
('Books & Notes', 'BookOpen', 'Textbooks, lab manuals, notebooks'),
('Clothing & Shoes', 'Shirt', 'Jackets, hoodies, caps, sneakers'),
('Jewelry & Watches', 'Watch', 'Wristwatches, rings, chains, bracelets'),
('Water Bottles', 'Droplet', 'Hydro flasks, stainless steel bottles'),
('Other Accessories', 'Grid', 'Glasses, umbrellas, miscellaneous items')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.badges (name, description, icon, min_points) VALUES
('Trusted Finder', 'Returned 3 or more lost items to owners', 'ShieldCheck', 50),
('Helpful Student', 'Active community member reporting found items', 'Award', 100),
('Top Contributor', 'Top 5 ranking student on campus leaderboard', 'Trophy', 250),
('Verified Campus User', 'Verified student ID badge', 'CheckCircle2', 10)
ON CONFLICT (name) DO NOTHING;
