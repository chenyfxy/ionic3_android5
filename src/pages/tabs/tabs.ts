import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Tabs, Tab, NavController, Events } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { EVENTS_KEY } from '../config/events_key';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  tabRoots: Object[];
  loginIndex: any;

  constructor(private storage: Storage, private navCtrl: NavController, public events: Events) {
    this.tabRoots = [ { root: HomePage, tabTitle: 'home', tabIcon: 'home' }, 
    { root: AboutPage, tabTitle: 'publish', tabIcon: 'add-circle' }, 
    { root: ContactPage, tabTitle: 'personal', tabIcon: 'person' } ];
  }

  tabChange(tab: Tab) {
    let currentIndex = this.tabRef.getIndex(tab);

    if (currentIndex == 2) {
      this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
        if (value == null) {
          this.navCtrl.setRoot(LoginPage);
        }
      })
    }
  }

  tabSelect() {
    this.events.publish(EVENTS_KEY.REFRESH_TAB_PAGE);
  }

  ionViewDidEnter() {
    this.events.subscribe('user:login', () => {
      let currentTab = this.tabRef.getSelected();
       this.loginIndex = this.tabRef.getIndex(currentTab);

       this.tabRef.select(this.loginIndex);
     });
  }
}
