import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { Notification, NotificationListResponse } from '../../types';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get<NotificationListResponse>('/notifications/');
      setNotifications(res.data.items);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (user) {
        const wsUrl = `ws://localhost:8000/api/v1/ws/${user.id}`;
        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'NEW_NOTIFICATION') {
                setNotifications(prev => [message.data, ...prev]);
                setUnreadCount(prev => prev + 1);
            }
        };

        return () => socket.close();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-brand-navy/70 hover:text-brand-navy transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-navy">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-brand-navy">Notifications</h3>
                <div className="flex gap-4">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-orange hover:underline flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                  <button
                    onClick={async () => {
                        try {
                            await api.delete('/notifications/clear-read');
                            setNotifications(prev => prev.filter(n => !n.is_read));
                        } catch (err) {
                            console.error('Failed to clear notifications', err);
                        }
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={12} /> Clear read
                  </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group ${
                      !n.is_read ? 'bg-brand-orange/5' : ''
                    }`}
                  >
                    {!n.is_read && (
                      <div className="absolute left-2 top-5 w-1.5 h-1.5 bg-brand-orange rounded-full" />
                    )}
                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {n.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-brand-navy mb-1">{n.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{n.content}</p>
                      
                      <div className="flex gap-3">
                        {n.link && (
                          <Link
                            to={n.link}
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-bold text-brand-orange flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink size={10} /> View Details
                          </Link>
                        )}
                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-[10px] font-bold text-gray-400 hover:text-brand-navy flex items-center gap-1"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <Link 
                    to="/notifications" 
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-brand-navy/60 hover:text-brand-navy font-semibold"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
