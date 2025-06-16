export interface WSNotification {
  id?: string;
  type: 'TASK_UPDATE' | 'NEW_COMMENT' | 'CONNECTED';
  message: string;
  taskId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  timestamp: Date;
  read?: boolean;
}
