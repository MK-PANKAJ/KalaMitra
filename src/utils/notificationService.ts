// Push & In-App Notifications System
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'product' | 'promo' | 'system' | 'message' | 'review';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
}

export class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Map<string, (notification: Notification) => void> = new Map();

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  create(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.push(newNotification);
    
    // Show browser notification if permitted
    this.showBrowserNotification(newNotification);
    
    // Trigger listeners
    this.notifyListeners(notification.userId, newNotification);
    
    // Store in localStorage for persistence
    this.saveToLocalStorage();
    
    return newNotification;
  }

  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const browserNotif = new Notification(notification.title, {
          body: notification.message,
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'high'
        });

        browserNotif.onclick = () => {
          window.focus();
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
          browserNotif.close();
        };
      } catch (error) {
        console.error('Failed to show browser notification:', error);
      }
    }
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
  }

  markAllAsRead(userId: string): void {
    const userNotifications = this.notifications.filter(n => n.userId === userId && !n.read);
    userNotifications.forEach(n => {
      n.read = true;
      n.readAt = new Date().toISOString();
    });
    this.saveToLocalStorage();
  }

  delete(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  deleteAll(userId: string): void {
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    this.saveToLocalStorage();
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  getNotifications(userId: string, limit?: number): Notification[] {
    const userNotifications = this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return limit ? userNotifications.slice(0, limit) : userNotifications;
  }

  getUnreadNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId && !n.read)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Listener management
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    const id = `${userId}-${Date.now()}`;
    this.listeners.set(id, callback);
    
    // Return unsubscribe function
    return () => this.listeners.delete(id);
  }

  private notifyListeners(userId: string, notification: Notification): void {
    this.listeners.forEach((callback, id) => {
      if (id.startsWith(userId)) {
        callback(notification);
      }
    });
  }

  // Persistence
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('kalamitra_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('kalamitra_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  // Predefined notification templates
  notifyOrderPlaced(userId: string, orderId: string, totalPrice: number): Notification {
    return this.create({
      userId,
      type: 'order',
      title: '🎉 Order Placed Successfully!',
      message: `Your order #${orderId.slice(0, 8)} for ₹${totalPrice} has been confirmed.`,
      priority: 'high',
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      icon: '📦'
    });
  }

  notifyOrderShipped(userId: string, orderId: string, trackingNumber?: string): Notification {
    return this.create({
      userId,
      type: 'order',
      title: '📦 Order Shipped!',
      message: `Your order #${orderId.slice(0, 8)} is on its way! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
      priority: 'high',
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'Track Order',
      icon: '🚚'
    });
  }

  notifyOrderDelivered(userId: string, orderId: string): Notification {
    return this.create({
      userId,
      type: 'order',
      title: '✅ Order Delivered!',
      message: `Your order #${orderId.slice(0, 8)} has been delivered. Enjoy your handcrafted product!`,
      priority: 'high',
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'Write Review',
      icon: '🎁'
    });
  }

  notifyPaymentSuccess(userId: string, orderId: string, amount: number): Notification {
    return this.create({
      userId,
      type: 'payment',
      title: '💳 Payment Successful',
      message: `Payment of ₹${amount} received for order #${orderId.slice(0, 8)}`,
      priority: 'medium',
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      icon: '✅'
    });
  }

  notifyPaymentFailed(userId: string, orderId: string, amount: number): Notification {
    return this.create({
      userId,
      type: 'payment',
      title: '❌ Payment Failed',
      message: `Payment of ₹${amount} for order #${orderId.slice(0, 8)} failed. Please try again.`,
      priority: 'high',
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'Retry Payment',
      icon: '⚠️'
    });
  }

  notifyProductQCApproved(userId: string, productId: string, productName: string): Notification {
    return this.create({
      userId,
      type: 'product',
      title: '✅ Product Approved!',
      message: `Your product "${productName}" has been QC approved and is now live!`,
      priority: 'medium',
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      icon: '🎨'
    });
  }

  notifyNewMessage(userId: string, senderName: string, conversationId: string): Notification {
    return this.create({
      userId,
      type: 'message',
      title: `💬 New Message from ${senderName}`,
      message: `You have a new message. Tap to view.`,
      priority: 'medium',
      actionUrl: `/messages/${conversationId}`,
      actionLabel: 'View Message',
      icon: '💬'
    });
  }

  notifyPromotion(userId: string, promoTitle: string, promoMessage: string, couponCode?: string): Notification {
    return this.create({
      userId,
      type: 'promo',
      title: `🎁 ${promoTitle}`,
      message: `${promoMessage}${couponCode ? ` Use code: ${couponCode}` : ''}`,
      priority: 'low',
      actionUrl: '/marketplace',
      actionLabel: 'Shop Now',
      icon: '🎉'
    });
  }

  notifyNewReview(userId: string, productName: string, rating: number): Notification {
    return this.create({
      userId,
      type: 'review',
      title: '⭐ New Review',
      message: `Your product "${productName}" received a ${rating}-star review!`,
      priority: 'low',
      actionUrl: '/reviews',
      actionLabel: 'View Reviews',
      icon: '⭐'
    });
  }
}

export const notificationService = new NotificationService();

// Initialize by loading from localStorage
notificationService.loadFromLocalStorage();
