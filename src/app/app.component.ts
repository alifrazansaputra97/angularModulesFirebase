import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { environment } from '../environments/environment'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.firebase.requestPermission();
    this.firebase.listen();
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'SET_VAPID_KEY',
        vapidKey: environment.VAPID_KEY
      });
    });
  }

}
