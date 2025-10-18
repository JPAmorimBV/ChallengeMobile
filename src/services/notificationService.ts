import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuração de como as notificações devem ser exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Registra o dispositivo para receber notificações
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;

      this.expoPushToken = token;
      console.log('Push Token:', token);

      // Configuração Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
        });
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Envia notificação local
   */
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger: null, // Imediatamente
    });
  }

  /**
   * Agenda notificação para o futuro
   */
  async scheduleNotification(
    notification: NotificationData,
    seconds: number
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger: {
        seconds,
      },
    });
  }

  /**
   * Cancela notificação agendada
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancela todas as notificações
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Obtém token de push
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Listener para notificações recebidas
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Listener para quando usuário toca na notificação
   */
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Envia notificação quando moto é criada
   */
  async notifyMotoCreated(placa: string): Promise<void> {
    await this.sendLocalNotification({
      title: '🏍️ Nova Moto Cadastrada!',
      body: `A moto ${placa} foi cadastrada com sucesso.`,
      data: { type: 'moto_created', placa },
    });
  }

  /**
   * Envia notificação quando moto é atualizada
   */
  async notifyMotoUpdated(placa: string): Promise<void> {
    await this.sendLocalNotification({
      title: '🔄 Moto Atualizada',
      body: `Os dados da moto ${placa} foram atualizados.`,
      data: { type: 'moto_updated', placa },
    });
  }

  /**
   * Envia notificação quando moto é deletada
   */
  async notifyMotoDeleted(placa: string): Promise<void> {
    await this.sendLocalNotification({
      title: '🗑️ Moto Excluída',
      body: `A moto ${placa} foi removida do sistema.`,
      data: { type: 'moto_deleted', placa },
    });
  }

  /**
   * Envia notificação de lembrete
   */
  async notifyReminder(message: string): Promise<void> {
    await this.sendLocalNotification({
      title: '📌 Lembrete Nexus Tech',
      body: message,
      data: { type: 'reminder' },
    });
  }
}

export const notificationService = new NotificationService();
