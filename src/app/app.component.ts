import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { TranslateService } from 'ng2-translate';
import { LoginPage } from '../pages/login/login';
import { SESSION_KEY } from '../pages/config/session_key';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    translate: TranslateService, storage: Storage, public localNotifications: LocalNotifications) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // set language
      translate.use('en');

      this.testStatus();
    });
  }

  testStatus() { 
    this.localNotifications.schedule({ 
      id: 1, 
      title: 'Welcome to this app', 
      text: '这是显示通知栏的内容',
      icon: 'file://assets/imgs/logo.png',
      smallIcon: 'res://ic_popup_reminder'
    });
  }
}
