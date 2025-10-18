import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notificationService';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    // Registrar para notificações
    registerForPushNotifications();

    // Listener para notificações recebidas
    const notificationListener = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listener para quando usuário toca na notificação
    const responseListener = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        // Aqui você pode navegar para telas específicas baseado no tipo
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const registerForPushNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    setExpoPushToken(token);
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    await notificationService.sendLocalNotification({ title, body, data });
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        sendLocalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
