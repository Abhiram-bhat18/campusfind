import { Building, Category, Item, UserProfile, Announcement, Badge } from '../types';

export const INITIAL_BUILDINGS: Building[] = [
  { id: 'bld-1', campus_id: 'cmp-1', name: 'Torii Block', code: 'TORII', floors: 3, latitude: 12.9716, longitude: 77.5946 },
  { id: 'bld-2', campus_id: 'cmp-1', name: 'School Of Computing Block', code: 'SOC', floors: 6, latitude: 12.9722, longitude: 77.5952 },
  { id: 'bld-3', campus_id: 'cmp-1', name: 'Main Campus Library', code: 'MCL', floors: 2, latitude: 12.9710, longitude: 77.5938 },
  { id: 'bld-4', campus_id: 'cmp-1', name: 'NCET Food Court', code: 'NFC', floors: 2, latitude: 12.9705, longitude: 77.5960 },
  { id: 'bld-5', campus_id: 'cmp-1', name: 'NCET Boys Hostel Complex', code: 'NBHC', floors: 10, latitude: 12.9730, longitude: 77.5930 },
  { id: 'bld-6', campus_id: 'cmp-1', name: 'Sports Complex & Indoor Stadium', code: 'SCS', floors: 4, latitude: 12.9698, longitude: 77.5942 },
  { id: 'bld-7', campus_id: 'cmp-1', name: 'Administrative & Registration Office', code: 'ARO', floors: 2, latitude: 12.9718, longitude: 77.5965 },
  { id: 'bld-8', campus_id: 'cmp-1', name: 'New Block ', code: 'NB', floors: 4, latitude: 12.9758, longitude: 77.5975 }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', icon: 'Smartphone', description: 'Phones, laptops, chargers, earbuds, powerbanks' },
  { id: 'cat-2', name: 'Wallets & Purses', icon: 'Wallet', description: 'Leather wallets, card holders, purses' },
  { id: 'cat-3', name: 'ID Cards & Docs', icon: 'CreditCard', description: 'Student ID cards, library cards, driver licenses' },
  { id: 'cat-4', name: 'Keys', icon: 'Key', description: 'Hostel keys, vehicle keys, lanyards' },
  { id: 'cat-5', name: 'Bags & Backpacks', icon: 'Backpack', description: 'College backpacks, gym bags, laptop sleeves' },
  { id: 'cat-6', name: 'Books & Notes', icon: 'BookOpen', description: 'Textbooks, notebooks, assignment files' },
  { id: 'cat-7', name: 'Clothing & Accessories', icon: 'Shirt', description: 'Jackets, hoodies, caps, sunglasses, umbrellas' },
  { id: 'cat-8', name: 'Jewelry & Watches', icon: 'Watch', description: 'Smartwatches, analog watches, rings, chains' },
  { id: 'cat-9', name: 'Water Bottles', icon: 'Droplet', description: 'Stainless steel bottles, hydro flasks' },
  { id: 'cat-10', name: 'Sports Equipment', icon: 'Trophy', description: 'Badminton rackets, basketballs, gym gear' }
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'bdg-1', name: 'Trusted Finder', description: 'Returned 3 or more lost items to legitimate owners', icon: 'ShieldCheck', min_points: 50 },
  { id: 'bdg-2', name: 'Helpful Student', description: 'Actively reporting found items on campus', icon: 'Award', min_points: 100 },
  { id: 'bdg-3', name: 'Campus Guardian', description: 'Resolved 10+ items and verified student ID', icon: 'Star', min_points: 200 },
  { id: 'bdg-4', name: 'Top Contributor', description: 'Top 3 ranked student on monthly leaderboard', icon: 'Trophy', min_points: 350 }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-1',
    email: 'alex.chen@campus.edu',
    full_name: 'Alex Chen',
    role: 'STUDENT',
    department: 'Computer Science & Engg',
    year_of_study: 3,
    student_id: 'CS2023-8849',
    whatsapp_number: '+919876543210',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'CS Junior | Tech Enthusiast | AI Researcher | Always happy to return lost items!',
    is_verified: true,
    reputation_points: 180,
    created_at: '2025-09-01T10:00:00Z',
    active_posts_count: 2,
    resolved_posts_count: 5,
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[1]]
  },
  {
    id: 'user-2',
    email: 'priya.sharma@campus.edu',
    full_name: 'Priya Sharma',
    role: 'STUDENT',
    department: 'Electronics & Comm Engg',
    year_of_study: 2,
    student_id: 'EC2024-4412',
    whatsapp_number: '+919876543211',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'ECE 2nd Year | Robotics Club Lead | Coffee Lover',
    is_verified: true,
    reputation_points: 120,
    created_at: '2025-10-12T14:30:00Z',
    active_posts_count: 1,
    resolved_posts_count: 3,
    badges: [INITIAL_BADGES[0]]
  },
  {
    id: 'user-3',
    email: 'admin.safety@campus.edu',
    full_name: 'Prof. David Vance',
    role: 'ADMIN',
    department: 'Campus Security & Student Affairs',
    year_of_study: 4,
    student_id: 'FAC-9001',
    whatsapp_number: '+919876543299',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Campus Operations Administrator & Student Welfare Officer',
    is_verified: true,
    reputation_points: 500,
    created_at: '2025-01-01T08:00:00Z',
    active_posts_count: 0,
    resolved_posts_count: 12,
    badges: [INITIAL_BADGES[2], INITIAL_BADGES[3]]
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-1',
    user_id: 'user-1',
    user_profile: INITIAL_USERS[0],
    type: 'LOST',
    title: 'Apple AirPods Pro 2 in Blue Silicon Case',
    description: 'Lost my AirPods Pro 2 in a dark blue translucent silicone case. Left them near Lab 302 on the 3rd floor. Has a small sticker of a cyber-cat on the back. Urgent as I need them for project work!',
    category_id: 'cat-1',
    category_name: 'Electronics',
    brand: 'Apple',
    primary_color: 'Blue / White',
    building_id: 'bld-1',
    building_name: 'Torii Block',
    floor_number: 3,
    specific_location: 'Lab 302 Desk 14',
    latitude: 12.9716,
    longitude: 77.5946,
    date_occurred: '2026-08-01',
    time_occurred: '14:30',
    reward_amount: 500,
    contact_whatsapp: '+919876543210',
    additional_contact: 'Discord: alexc_dev',
    tags: ['AirPods', 'Apple', 'Earbuds', 'Blue Case', 'Lab 302'],
    status: 'OPEN',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    ai_confidence_score: 0.94,
    ocr_extracted_text: 'AirPods Pro Serial No: H3X99201A',
    qr_code_data: 'CAMPUSFIND-LOST-ITEM-1-ALEXCHEN',
    view_count: 42,
    created_at: '2026-08-01T15:00:00Z',
    updated_at: '2026-08-01T15:00:00Z',
    is_bookmarked: true
  },
  {
    id: 'item-2',
    user_id: 'user-2',
    user_profile: INITIAL_USERS[1],
    type: 'FOUND',
    title: 'Student ID Card - Roll No: CS2023-8849',
    description: 'Found an official College Student ID Card lying on the bench near Central Library entrance. Name visible: Alex Chen. Handed temporarily to security counter or claim directly through this portal.',
    category_id: 'cat-3',
    category_name: 'ID Cards & Docs',
    brand: 'Campus ID Authority',
    primary_color: 'White / Blue',
    building_id: 'bld-3',
    building_name: 'Main Campus Library',
    floor_number: 1,
    specific_location: 'Outdoor Coffee Bench near entrance',
    latitude: 12.9710,
    longitude: 77.5938,
    date_occurred: '2026-08-02',
    time_occurred: '10:15',
    contact_whatsapp: '+919876543211',
    tags: ['Student ID', 'ID Card', 'Alex Chen', 'Library Bench'],
    status: 'OPEN',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80'
    ],
    ai_confidence_score: 0.98,
    ocr_extracted_text: 'CAMPUS UNIVERSITY STUDENT ID NAME: ALEX CHEN DEPT: COMPUTER SCIENCE ROLL: CS2023-8849 VALID TILL 2027',
    qr_code_data: 'CAMPUSFIND-FOUND-ITEM-2-PRIYA',
    view_count: 29,
    created_at: '2026-08-02T10:30:00Z',
    updated_at: '2026-08-02T10:30:00Z',
    is_bookmarked: false
  },
  {
    id: 'item-3',
    user_id: 'user-2',
    user_profile: INITIAL_USERS[1],
    type: 'FOUND',
    title: 'Matte Black Wireless Mechanical Keyboard (Keychron K2)',
    description: 'Found a black wireless mechanical keyboard left in Seminar Hall A after the afternoon guest lecture. Has brown switches and RGB lighting backplate.',
    category_id: 'cat-1',
    category_name: 'Electronics',
    brand: 'Keychron',
    primary_color: 'Black',
    building_id: 'bld-2',
    building_name: 'School Of Computing Block',
    floor_number: 2,
    specific_location: 'Seminar Hall A, Row 4',
    latitude: 12.9722,
    longitude: 77.5952,
    date_occurred: '2026-08-01',
    time_occurred: '17:00',
    contact_whatsapp: '+919876543211',
    tags: ['Keyboard', 'Keychron', 'Mechanical', 'Black', 'Seminar Hall'],
    status: 'OPEN',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    ai_confidence_score: 0.89,
    qr_code_data: 'CAMPUSFIND-FOUND-ITEM-3-KEYCHRON',
    view_count: 65,
    created_at: '2026-08-01T17:30:00Z',
    updated_at: '2026-08-01T17:30:00Z'
  },
  {
    id: 'item-4',
    user_id: 'user-1',
    user_profile: INITIAL_USERS[0],
    type: 'LOST',
    title: 'Brown Leather Tommy Hilfiger Wallet with Keys',
    description: 'Lost my brown leather wallet containing driver license, hostel room key 204, and ATM cards. Might have fallen near the Food Court outdoor dining table.',
    category_id: 'cat-2',
    category_name: 'Wallets & Purses',
    brand: 'Tommy Hilfiger',
    primary_color: 'Brown',
    building_id: 'bld-4',
    building_name: 'Student Activity Center & Food Court',
    floor_number: 1,
    specific_location: 'Food Court Table 12',
    latitude: 12.9705,
    longitude: 77.5960,
    date_occurred: '2026-07-31',
    time_occurred: '13:00',
    reward_amount: 1000,
    contact_whatsapp: '+919876543210',
    tags: ['Wallet', 'Leather', 'Brown', 'Tommy Hilfiger', 'Keys'],
    status: 'RESOLVED',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
    ],
    ai_confidence_score: 0.91,
    qr_code_data: 'CAMPUSFIND-LOST-ITEM-4-WALLET',
    view_count: 110,
    created_at: '2026-07-31T13:45:00Z',
    updated_at: '2026-08-01T09:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    title: '🚨 Annual Campus Tech Fest Lost & Found Desk Active',
    content: 'Special lost & found counter established at Student Activity Center Ground Floor for all Tech Fest items. Please register any items found immediately to help fellow students!',
    priority: 'URGENT',
    created_at: '2026-08-01T08:00:00Z'
  },
  {
    id: 'anc-2',
    title: '✨ Smart AI Match Engine Upgrade Deployed',
    content: 'CampusFind now automatically scans uploaded ID cards using OCR and detects matching Lost/Found items with up to 98% accuracy score. Update your posts with clear photos for instant matches.',
    priority: 'NORMAL',
    created_at: '2026-07-28T10:00:00Z'
  }
];
