
import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

const NotificationTray = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    setupSubscription();
  }, []);

  const getLocalNotifications = (userId: string): Notification[] => {
    try {
      const stored = localStorage.getItem(`ekitsa_notifications_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default system welcome notifications
    const defaultNotifs: Notification[] = [
      {
        id: 'notif-welcome-1',
        title: 'Welcome to Ekitsa Platform',
        message: 'Explore certified diagnostic laboratories and book doctor consultations with transparent pricing.',
        type: 'info',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'notif-system-2',
        title: 'Verified Facilities Online',
        message: 'All listed pathology and diagnostic centers are verified for precision and home sample collection.',
        type: 'success',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    try {
      localStorage.setItem(`ekitsa_notifications_${userId}`, JSON.stringify(defaultNotifs));
    } catch {}
    return defaultNotifs;
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || localStorage.getItem('userRole') || 'guest';
      if (!user && !localStorage.getItem('userRole')) return;

      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.is_read).length);
          return;
        }
      }

      // Fallback to local storage notifications if table does not exist or has no rows
      const local = getLocalNotifications(currentUserId);
      setNotifications(local);
      setUnreadCount(local.filter(n => !n.is_read).length);
    } catch (error: any) {
      // Suppress missing table error cleanly
      const currentUserId = localStorage.getItem('userRole') || 'guest';
      const local = getLocalNotifications(currentUserId);
      setNotifications(local);
      setUnreadCount(local.filter(n => !n.is_read).length);
    }
  };

  const setupSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('notifications-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            if (newNotification.type === 'error' || newNotification.type === 'warning') {
              toast(newNotification.title, {
                description: newNotification.message,
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignore subscription errors if table does not exist
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch {}

    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, is_read: true } : n);
      try {
        const { data: { user } } = supabase.auth.getUser() as any;
        const uid = user?.id || localStorage.getItem('userRole') || 'guest';
        localStorage.setItem(`ekitsa_notifications_${uid}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
      }
    } catch {}

    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, is_read: true }));
      try {
        const uid = localStorage.getItem('userRole') || 'guest';
        localStorage.setItem(`ekitsa_notifications_${uid}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-200" align="end">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h4 className="font-bold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7 px-2 text-primary font-bold hover:bg-primary/5"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className={`text-sm leading-none ${!notification.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-slate-500 h-8">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTray;
