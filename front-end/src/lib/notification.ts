type NotificationType = 'success' | 'error' | 'info';

export type NotificationMessage = {
  id: number;
  message: string;
  type: NotificationType;
};

type Listener = (messages: NotificationMessage[]) => void;

class NotificationService {
  private messages: NotificationMessage[] = [];
  private listeners: Listener[] = [];

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.messages));
  }

  show(message: string, type: NotificationType = 'info', duration = 3000) {
    const newMessage: NotificationMessage = {
      id: Date.now(),
      message,
      type,
    };

    this.messages = [newMessage, ...this.messages];
    this.notify();

    setTimeout(() => {
      this.remove(newMessage.id);
    }, duration);
  }

  remove(id: number) {
    this.messages = this.messages.filter((msg) => msg.id !== id);
    this.notify();
  }
}

export const notificationService = new NotificationService();

