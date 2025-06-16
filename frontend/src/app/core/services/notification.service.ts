import { Injectable, signal } from '@angular/core';
import { WebSocketService } from './websocket.service';

export interface Notification {
  id: string;
  type: 'comment' | 'update';
  title: string;
  message: string;
  taskId: string;
  read: boolean;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor(private websocketService: WebSocketService) {
    this.websocketService.connect();
    
    this.websocketService.messages$.subscribe(message => {
      if (message.type === 'notification') {
        this.addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: message.data.type,
          title: message.data.title,
          message: message.data.message,
          taskId: message.data.taskId,
          read: false,
          timestamp: new Date()
        });
      }
    });
  }

  addNotification(notification: Notification) {
    this.notifications.update(notifs => [notification, ...notifs]);
    this.unreadCount.update(count => count + 1);
  }

  markAsRead(id: string) {
    this.notifications.update(notifs => 
      notifs.map(n => n.id === id ? {...n, read: true} : n)
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notifications.update(notifs => 
      notifs.map(n => ({...n, read: true}))
    );
    this.unreadCount.set(0);
  }

  private updateUnreadCount() {
    this.unreadCount.set(
      this.notifications().filter(n => !n.read).length
    );
  }
}