import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core'

import { Platform } from '@ionic/angular';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  splash = true;
  constructor(
    private platform: Platform
  ) {
    SplashScreen.hide({fadeOutDuration:0});
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splash = false;
      }, 5000)
    });
  }
}
