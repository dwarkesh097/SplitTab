// import PushNotification from 'react-native-push-notification';
// import {Platform} from 'react-native';

// export class NotificationService {
//   private static instance: NotificationService;
  
//   private constructor() {
//     this.configure();
//   }
  
//   static getInstance(): NotificationService {
//     if (!NotificationService.instance) {
//       NotificationService.instance = new NotificationService();
//     }
//     return NotificationService.instance;
//   }
  
//   private configure() {
//     PushNotification.configure({
//       onRegister: (token) => {
//         console.log('Notification token:', token);
//       },
//       onNotification: (notification) => {
//         console.log('Notification received:', notification);
        
//         // Handle notification when app is in foreground
//         if (notification.userInteraction) {
//           // Handle deep linking
//           this.handleDeepLink(notification.data);
//         }
        
//         notification.finish(PushNotification.FetchResult.NoData);
//       },
//       onAction: (notification) => {
//         console.log('Notification action:', notification);
//       },
//       onRegistrationError: (err) => {
//         console.error('Notification registration error:', err);
//       },
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
//       popInitialNotification: true,
//       requestPermissions: Platform.OS === 'ios',
//     });
//   }
  
//   initialize() {
//     // Create default channels for Android
//     if (Platform.OS === 'android') {
//       PushNotification.createChannel(
//         {
//           channelId: 'expenses',
//           channelName: 'Expense Notifications',
//           channelDescription: 'Notifications for new expenses',
//           soundName: 'default',
//           importance: 4,
//           vibrate: true,
//         },
//         (created) => console.log(`Expenses channel created: ${created}`)
//       );
      
//       PushNotification.createChannel(
//         {
//           channelId: 'settlements',
//           channelName: 'Settlement Notifications',
//           channelDescription: 'Notifications for settlements',
//           soundName: 'default',
//           importance: 4,
//           vibrate: true,
//         },
//         (created) => console.log(`Settlements channel created: ${created}`)
//       );
//     }
//   }
  
//   notifyNewExpense(expenseData: {
//     id: string;
//     description: string;
//     amount: number;
//     groupId: string;
//     paidBy: string;
//   }) {
//     PushNotification.localNotification({
//       channelId: 'expenses',
//       title: 'New Expense Added',
//       message: `${expenseData.paidBy} added ${expenseData.description} for $${expenseData.amount}`,
//       userInfo: {
//         screen: 'ExpenseDetail',
//         expenseId: expenseData.id,
//         groupId: expenseData.groupId,
//       },
//       data: {
//         screen: 'ExpenseDetail',
//         expenseId: expenseData.id,
//         groupId: expenseData.groupId,
//       },
//       playSound: true,
//       soundName: 'default',
//       vibrate: true,
//     });
//   }
  
//   notifySettlement(settlementData: {
//     id: string;
//     fromUser: string;
//     toUser: string;
//     amount: number;
//     groupId: string;
//   }) {
//     PushNotification.localNotification({
//       channelId: 'settlements',
//       title: 'Settlement Received',
//       message: `${settlementData.fromUser} paid ${settlementData.toUser} $${settlementData.amount}`,
//       userInfo: {
//         screen: 'Settlements',
//         groupId: settlementData.groupId,
//       },
//       data: {
//         screen: 'Settlements',
//         groupId: settlementData.groupId,
//       },
//       playSound: true,
//       soundName: 'default',
//       vibrate: true,
//     });
//   }
  
//   private handleDeepLink(data: any) {
//     // This would integrate with navigation to deep link to specific screens
//     console.log('Deep linking to:', data);
//     // navigation.navigate(data.screen, {id: data.expenseId, groupId: data.groupId})
//   }
// }

// export const notificationService = NotificationService.getInstance();