export type ItemType = 'LOST' | 'FOUND';

export type ItemStatus = 'OPEN' | 'CLAIMED' | 'RESOLVED' | 'ARCHIVED';

export type ClaimStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'INFO_REQUESTED';

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ReportReason = 'SPAM' | 'FAKE_LISTING' | 'OFFENSIVE' | 'DUPLICATE' | 'WRONG_CATEGORY' | 'OTHER';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  year_of_study: number;
  student_id?: string;
  whatsapp_number: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  reputation_points: number;
  created_at: string;
  active_posts_count?: number;
  resolved_posts_count?: number;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  min_points: number;
  awarded_at?: string;
}

export interface Building {
  id: string;
  campus_id: string;
  name: string;
  code: string;
  floors: number;
  latitude: number;
  longitude: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  is_primary: boolean;
  ai_tags?: string[];
}

export interface Item {
  id: string;
  user_id: string;
  user_profile?: UserProfile;
  type: ItemType;
  title: string;
  description: string;
  category_id: string;
  category_name?: string;
  brand?: string;
  primary_color?: string;
  building_id: string;
  building_name?: string;
  floor_number?: number;
  specific_location: string;
  latitude?: number;
  longitude?: number;
  date_occurred: string;
  time_occurred?: string;
  reward_amount?: number;
  contact_whatsapp: string;
  additional_contact?: string;
  tags: string[];
  status: ItemStatus;
  images: string[];
  ai_confidence_score?: number;
  ocr_extracted_text?: string;
  qr_code_data?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  is_bookmarked?: boolean;
}

export interface Claim {
  id: string;
  item_id: string;
  item?: Item;
  claimant_id: string;
  claimant_profile?: UserProfile;
  owner_id: string;
  owner_profile?: UserProfile;
  status: ClaimStatus;
  reason: string;
  identifying_details: string;
  proof_image_url?: string;
  contact_number: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
}

export interface ClaimMessage {
  id: string;
  claim_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  message: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'CLAIM' | 'MESSAGE' | 'MATCH' | 'SYSTEM';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'NORMAL' | 'URGENT' | 'EVENT';
  created_at: string;
}

export interface FilterState {
  type: 'ALL' | 'LOST' | 'FOUND';
  categoryId: string;
  buildingId: string;
  department: string;
  status: ItemStatus | 'ALL';
  dateRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  searchQuery: string;
  sortBy: 'LATEST' | 'OLDEST' | 'RELEVANCE';
}

export interface AIMatchResult {
  matchedItem: Item;
  confidenceScore: number;
  matchReasons: string[];
}
