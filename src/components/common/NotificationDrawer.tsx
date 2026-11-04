import React from 'react';
import { X, Bell, CheckCircle2, Clock, Droplet, Package, ShieldCheck, Check, Trash2 } from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useMediStockStore();

  if (!isOpen) return null;

  const iconMap: Record<string, any> = {
    order: Package,
    blood: Droplet,
    approval: ShieldCheck,
    demand: CheckCircle2,
    security: ShieldCheck,
    system: Bell,
    stock: Package,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
          
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-teal-600 font-semibold">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllNotificationsRead}
                    title="Mark all as read"
                    className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg text-xs"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearNotifications}
                    title="Clear all"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-xs text-slate-500">No notifications yet</p>
                <p className="text-[11px] text-slate-400">All caught up!</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = iconMap[n.type] || Bell;
                const isUnread = !n.read;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.type === 'blood') {
                        onClose();
                        onNavigate('blood');
                      } else if (n.type === 'order') {
                        onClose();
                        onNavigate('user-dashboard');
                      }
                    }}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                      isUnread ? 'bg-teal-50/40' : 'bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'blood' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-teal-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {n.title}
                        </h4>
                        {isUnread && <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">{n.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t bg-slate-50 text-center text-xs text-slate-500">
            Showing latest healthcare activity alerts
          </div>

        </div>
      </div>
    </div>
  );
};

