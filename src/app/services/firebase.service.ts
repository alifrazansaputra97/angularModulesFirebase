import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private messaging: Messaging
  ) { }

  requestPermission() {
    return getToken(this.messaging, {
      vapidKey: environment.VAPID_KEY
    }).then(token => {
      console.log('FCM TOKEN', token);
      return token;
    }).catch(err => {
      console.log('ERROR', err);
    })
  }

  listen() {
    return onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      if (Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || 'Notifikasi';
        const notificationOptions = {
          body: payload.notification?.body || '',
          icon: payload.notification?.icon || '/assets/icons/icon-72x72.png'
        };
        new Notification(notificationTitle, notificationOptions);
      }
    })
  }
}
