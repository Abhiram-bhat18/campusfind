import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Item,
  Claim,
  ClaimMessage,
  Notification,
  Announcement,
  Building,
  Category,
  FilterState,
  ReportReason
} from '../types';
import {
  INITIAL_BUILDINGS,
  INITIAL_CATEGORIES,
  INITIAL_ANNOUNCEMENTS
} from '../data/mockData';
import { DatabaseService } from '../services/dbService';
import { calculateAIMatchScore } from '../utils/aiEngine';
import confetti from 'canvas-confetti';

interface DataContextType {
  items: Item[];
  buildings: Building[];
  categories: Category[];
  announcements: Announcement[];
  claims: Claim[];
  messages: ClaimMessage[];
  notifications: Notification[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  clearAllData: () => void;
  addItem: (itemData: Partial<Item>) => Item;
  updateItemStatus: (itemId: string, status: Item['status']) => void;
  toggleBookmark: (itemId: string) => void;
  createClaim: (claimData: Omit<Claim, 'id' | 'created_at' | 'updated_at' | 'status'>) => Claim;
  updateClaimStatus: (claimId: string, status: Claim['status']) => void;
  sendMessage: (claimId: string, text: string, senderId: string, imageUrl?: string) => void;
  markNotificationsAsRead: () => void;
  reportItem: (itemId: string, reporterId: string, reason: ReportReason, details?: string) => void;
  addAnnouncement: (title: string, content: string, priority: Announcement['priority']) => void;
  findSmartMatchesForItem: (item: Item) => Array<{ matchedItem: Item; confidenceScore: number; matchReasons: string[] }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_CLAIMS = 'campusfind_db_claims';
const LOCAL_STORAGE_MESSAGES = 'campusfind_db_messages';
const LOCAL_STORAGE_NOTIFS = 'campusfind_db_notifs';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Load persistent items from DatabaseService
  const [items, setItems] = useState<Item[]>(() => DatabaseService.getItems());

  // Save persistent items whenever updated
  useEffect(() => {
    DatabaseService.saveItems(items);
  }, [items]);

  // Claims State
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CLAIMS);
    return saved ? JSON.parse(saved) : [];
  });

  // Realtime Messages State
  const [messages, setMessages] = useState<ClaimMessage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES);
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  // Global Filters State
  const [filters, setFilters] = useState<FilterState>({
    type: 'ALL',
    categoryId: 'ALL',
    buildingId: 'ALL',
    department: 'ALL',
    status: 'ALL',
    dateRange: 'ALL',
    searchQuery: '',
    sortBy: 'LATEST'
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CLAIMS, JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const resetFilters = () => {
    setFilters({
      type: 'ALL',
      categoryId: 'ALL',
      buildingId: 'ALL',
      department: 'ALL',
      status: 'ALL',
      dateRange: 'ALL',
      searchQuery: '',
      sortBy: 'LATEST'
    });
  };

  const clearAllData = () => {
    DatabaseService.clearAllStoredData();
    setItems([]);
    setClaims([]);
    setMessages([]);
    setNotifications([]);
    setAnnouncements([]);
    resetFilters();
  };

  const addItem = (itemData: Partial<Item>): Item => {
    const bld = buildings.find((b) => b.id === itemData.building_id);
    const cat = categories.find((c) => c.id === itemData.category_id);

    const newItem: Item = {
      id: `item-${Date.now()}`,
      user_id: itemData.user_id || 'usr-student-1',
      user_profile: itemData.user_profile,
      type: itemData.type || 'LOST',
      title: itemData.title || 'Untitled Report',
      description: itemData.description || '',
      category_id: itemData.category_id || 'cat-10',
      category_name: cat ? cat.name : 'Other Accessories',
      brand: itemData.brand || 'N/A',
      primary_color: itemData.primary_color || 'Multicolor',
      building_id: itemData.building_id || 'bld-1',
      building_name: bld ? bld.name : 'Main Campus',
      floor_number: itemData.floor_number || 1,
      specific_location: itemData.specific_location || 'Campus Premises',
      latitude: bld ? bld.latitude : 12.9716,
      longitude: bld ? bld.longitude : 77.5946,
      date_occurred: itemData.date_occurred || new Date().toISOString().slice(0, 10),
      time_occurred: itemData.time_occurred || '12:00',
      reward_amount: itemData.reward_amount || 0,
      contact_whatsapp: itemData.contact_whatsapp || '+919876543210',
      additional_contact: itemData.additional_contact || '',
      tags: itemData.tags || [],
      status: 'OPEN',
      images: itemData.images?.length ? itemData.images : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800'],
      ai_confidence_score: itemData.ai_confidence_score || 0.9,
      ocr_extracted_text: itemData.ocr_extracted_text || '',
      qr_code_data: `CAMPUSFIND-${itemData.type || 'ITEM'}-${Date.now()}`,
      view_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_bookmarked: false
    };

    setItems((prev) => {
      const updated = [newItem, ...prev];
      DatabaseService.saveItems(updated);
      return updated;
    });

    return newItem;
  };

  const updateItemStatus = (itemId: string, status: Item['status']) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status, updated_at: new Date().toISOString() } : i))
    );

    if (status === 'RESOLVED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const toggleBookmark = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, is_bookmarked: !i.is_bookmarked } : i))
    );
  };

  const createClaim = (claimData: Omit<Claim, 'id' | 'created_at' | 'updated_at' | 'status'>): Claim => {
    const item = items.find((i) => i.id === claimData.item_id);
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      status: 'PENDING',
      item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setClaims((prev) => [newClaim, ...prev]);
    return newClaim;
  };

  const updateClaimStatus = (claimId: string, status: Claim['status']) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status, updated_at: new Date().toISOString() } : c))
    );
  };

  const sendMessage = (claimId: string, text: string, senderId: string, imageUrl?: string) => {
    const newMsg: ClaimMessage = {
      id: `msg-${Date.now()}`,
      claim_id: claimId,
      sender_id: senderId,
      sender_name: 'Campus User',
      message: text,
      image_url: imageUrl,
      is_read: false,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const reportItem = (itemId: string, _reporterId: string, reason: ReportReason, details?: string) => {
    console.log(`Report submitted for item ${itemId} due to ${reason}: ${details}`);
  };

  const addAnnouncement = (title: string, content: string, priority: Announcement['priority']) => {
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title,
      content,
      priority,
      created_at: new Date().toISOString()
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  const findSmartMatchesForItem = (item: Item) => {
    const oppositeItems = items.filter((i) => i.type !== item.type && i.id !== item.id);
    return oppositeItems
      .map((cand) => calculateAIMatchScore(item, cand))
      .filter((res) => res.confidenceScore > 35)
      .sort((a, b) => b.confidenceScore - a.confidenceScore);
  };

  return (
    <DataContext.Provider
      value={{
        items,
        buildings,
        categories,
        announcements,
        claims,
        messages,
        notifications,
        filters,
        setFilters,
        resetFilters,
        clearAllData,
        addItem,
        updateItemStatus,
        toggleBookmark,
        createClaim,
        updateClaimStatus,
        sendMessage,
        markNotificationsAsRead,
        reportItem,
        addAnnouncement,
        findSmartMatchesForItem
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
