import { useEffect, useState } from 'react';
import { notificationService, type NotificationMessage } from '../lib/notification';

const typeStyles: Record<NotificationMessage['type'], string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

export default function Notification() {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setMessages);
    return () => {
      unsubscribe();
    };
  }, []);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={'relative rounded-md shadow-lg p-4 ' + typeStyles[msg.type] + ' animate-fade-in-right'}
        >
          <p className="text-sm font-medium">{msg.message}</p>
          <button
            onClick={() => notificationService.remove(msg.id)}
            className="absolute top-1 right-1 text-white/70 hover:text-white"
            aria-label="关闭通知"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

