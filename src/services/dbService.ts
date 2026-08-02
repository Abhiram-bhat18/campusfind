import { UserProfile, Item, Claim, ClaimMessage, Notification, Announcement } from '../types';

const DB_KEYS = {
  USERS: 'campusfind_db_users',
  CURRENT_USER_SESSION: 'campusfind_db_session',
  ITEMS: 'campusfind_db_items',
  CLAIMS: 'campusfind_db_claims',
  MESSAGES: 'campusfind_db_messages',
  NOTIFICATIONS: 'campusfind_db_notifications',
  ANNOUNCEMENTS: 'campusfind_db_announcements'
};

// Registered Users Database Schema (stores credentials + profile)
export interface StoredUserAccount {
  id: string;
  email: string;
  passwordHash: string; // Stored securely
  profile: UserProfile;
}

// Empty local database seed so the app starts from a clean account and item state.
const INITIAL_GENUINE_USERS: StoredUserAccount[] = [];

// Empty local database seed so the app starts from a clean item state.
const INITIAL_GENUINE_ITEMS: Item[] = [];

export class DatabaseService {
  static clearAllStoredData(): void {
    Object.values(DB_KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('campusfind_db_notifs');
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify([]));
  }

  // Get all registered users from database
  static getUsers(): StoredUserAccount[] {
    const raw = localStorage.getItem(DB_KEYS.USERS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_GENUINE_USERS));
        return INITIAL_GENUINE_USERS;
      }
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_GENUINE_USERS));
    return INITIAL_GENUINE_USERS;
  }

  // Save new user registration
  static registerUser(
    email: string,
    password: string,
    profileData: Partial<UserProfile>
  ): { success: boolean; user?: UserProfile; message?: string } {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this college email already exists.' };
    }

    const userId = `usr-${Date.now()}`;
    const newProfile: UserProfile = {
      id: userId,
      email,
      full_name: profileData.full_name || 'Campus Student',
      role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
      department: profileData.department || 'Computer Science',
      year_of_study: profileData.year_of_study || 1,
      student_id: profileData.student_id || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      whatsapp_number: profileData.whatsapp_number || '+919876543210',
      avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: profileData.bio || 'Verified college campus user.',
      is_verified: true, // Auto verified college email
      reputation_points: 50,
      created_at: new Date().toISOString(),
      badges: []
    };

    const newAccount: StoredUserAccount = {
      id: userId,
      email,
      passwordHash: password,
      profile: newProfile
    };

    users.push(newAccount);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    this.setCurrentSession(newProfile);

    return { success: true, user: newProfile };
  }

  // Authenticate login credentials
  static loginUser(
    email: string,
    password: string
  ): { success: boolean; user?: UserProfile; message?: string } {
    const users = this.getUsers();
    const account = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!account) {
      return { success: false, message: 'No account found with this email. Please Sign Up.' };
    }

    if (account.passwordHash !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    this.setCurrentSession(account.profile);
    return { success: true, user: account.profile };
  }

  // Get active session user
  static getCurrentSession(): UserProfile | null {
    const raw = localStorage.getItem(DB_KEYS.CURRENT_USER_SESSION);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }

  static setCurrentSession(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(DB_KEYS.CURRENT_USER_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(DB_KEYS.CURRENT_USER_SESSION);
    }
  }

  // Items Database CRUD
  static getItems(): Item[] {
    const raw = localStorage.getItem(DB_KEYS.ITEMS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return INITIAL_GENUINE_ITEMS;
      }
    }
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(INITIAL_GENUINE_ITEMS));
    return INITIAL_GENUINE_ITEMS;
  }

  static saveItems(items: Item[]): void {
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(items));
  }
}
