import { useState, useEffect } from 'react';
import type { Notification } from '@/components/shared/notification-panel';

// Mock notification data - in a real app, this would come from an API
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'candidate',
      title: 'New Candidate Application',
      message: 'Sarah Johnson has applied for Senior Developer position',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      priority: 'high',
      candidateName: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Technical interview scheduled for tomorrow at 2:00 PM',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      priority: 'medium',
      candidateName: 'Alex Chen',
      interviewer: 'John Smith'
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Interview Reminder',
      message: 'You have an interview with Mike Wilson in 1 hour',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: true,
      priority: 'high',
      candidateName: 'Mike Wilson'
    },
    {
      id: '4',
      type: 'system',
      title: 'Data Sync Complete',
      message: 'Successfully synced 12 candidates from Airtable',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'candidate',
      title: 'Candidate Status Update',
      message: 'Emma Davis moved to Final Interview stage',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
      priority: 'medium',
      candidateName: 'Emma Davis'
    },
    {
      id: '6',
      type: 'interview',
      title: 'Interview Feedback Required',
      message: 'Please provide feedback for Lisa Martinez interview',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      priority: 'high',
      candidateName: 'Lisa Martinez'
    },
    {
      id: '7',
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly recruitment report is ready for review',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: 'low'
    }
  ];

  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setNotifications(generateMockNotifications());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };
}