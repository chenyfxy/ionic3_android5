import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Tabs, Tab, NavController } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  tabRoots: Object[];

  constructor(private storage: Storage, private navCtrl: NavController, public cd: ChangeDetectorRef) {
    this.tabRoots = [ { root: HomePage, tabTitle: 'home', tabIcon: 'home', needValid: false }, 
    { root: AboutPage, tabTitle: 'publish', tabIcon: 'add-circle', needValid: true }, 
    { root: ContactPage, tabTitle: 'personal', tabIcon: 'person', needValid: true } ];
  }

  tabChange(tab: Tab) {
    let currentIndex = this.tabRef.getIndex(tab);

    if (currentIndex != 0) {
      this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
        if (value == null) {
          this.navCtrl.push(LoginPage);
        }
      })
    }
    this.cd.detectChanges();
  }

  
  ionViewDidEnter() {
    this.tabRef.select(0);
  }
}
