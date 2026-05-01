// context/NotificationContext.tsx
// Place this file at: TrackingSystemMobApp/context/NotificationContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Polls /api/notifications every 10 seconds.
// Decodes userId from the same JWT token your login already saves.
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// const API_BASE = "http://10.114.117.145:3000/api/notifications";
const API_BASE = "https://fyp-coral.vercel.app/api/notifications";

const POLL_MS  = 10000; // 10 seconds

export interface AppNotification {
  _id: string;
  type: "task_assigned" | "reward_earned" | "task_completed" | "general";
  title: string;
  message: string;
  data: {
    taskId?: string;
    taskNo?: number;
    order?: number;
    returnToOffice?: boolean;
    [key: string]: any;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount:   number;
  loading:       boolean;
  refresh:       () => void;
  markRead:      (id: string) => Promise<void>;
  markAllRead:   () => Promise<void>;
}

interface JwtPayload {
  userId?: string;
  name?:   string;
  email?:  string;
  login?:  boolean;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount:   0,
  loading:       true,
  refresh:       () => {},
  markRead:      async () => {},
  markAllRead:   async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [userId,        setUserId]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get userId from the same JWT your login stores
  useEffect(() => {
    AsyncStorage.getItem("token").then(token => {
      if (!token) return;
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.userId) setUserId(decoded.userId);
      } catch (e) {
        console.error("NotificationContext: decode failed", e);
      }
    });
  }, []);

  // In the useEffect where you decode the token — add the console.log:
useEffect(() => {
  AsyncStorage.getItem("token").then(token => {
    if (!token) return;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      console.log("🔍 DECODED TOKEN:", JSON.stringify(decoded)); // ← ADD THIS
      console.log("🔍 userId value:", decoded.userId);           // ← ADD THIS
      
      if (decoded.userId) setUserId(decoded.userId);
    } catch (e) {
      console.error("NotificationContext: decode failed", e);
    }
  });
}, []);

  const fetchNotifications = useCallback(async (uid: string) => {
    if (!uid) return;
    try {
      const res  = await fetch(`${API_BASE}?userId=${uid}`);
      const json = await res.json();
      if (res.ok) {
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount     || 0);
      }
    } catch {
      // silent — retry on next poll
    } finally {
      setLoading(false);
    }
  }, []);

  // Start polling once userId is ready
  useEffect(() => {
    if (!userId) return;
    fetchNotifications(userId);
    intervalRef.current = setInterval(() => fetchNotifications(userId), POLL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [userId, fetchNotifications]);

  const markRead = useCallback(async (notificationId: string) => {
    try {
      await fetch(API_BASE, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ notificationId }),
      });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("markRead failed", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    try {
      await fetch(API_BASE, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId, markAllRead: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("markAllRead failed", e);
    }
  }, [userId]);

  const refresh = useCallback(() => fetchNotifications(userId), [userId, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, refresh, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);