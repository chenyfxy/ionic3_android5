import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Tabs, Tab, NavController, Events } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { EVENTS_KEY } from '../config/events_key';
import { user_list } from '../data/userData';
import { UserModel } from '../model/UserModel';

const base_img_url = './assets/imgs/';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  tabRoots: Object[];

  constructor(private storage: Storage, private navCtrl: NavController, public events: Events) {
    this.tabRoots = [{ root: HomePage, tabTitle: 'home', tabIcon: 'home' },
    { root: AboutPage, tabTitle: 'publish', tabIcon: 'add-circle' },
    { root: ContactPage, tabTitle: 'personal', tabIcon: 'person' }];
  }

  tabChange(tab: Tab) {
    // let currentIndex = this.tabRef.getIndex(tab);

    // if (currentIndex == 2) {
    //   this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
    //     if (value == null) {
    //       this.navCtrl.setRoot(LoginPage);
    //     }
    //   })
    // }
  }

  initUserList() {
    this.storage.get(SESSION_KEY.ALL_USERS).then(value => {
      if (value == null) {
        let userList: UserModel[] = [];

        for (var index in user_list) {
          let userObj = user_list[index];
          let userRow = new UserModel();

          userRow.id = userObj.id;
          userRow.userName = userObj.userName;
          userRow.password = userObj.password;
          userRow.nickName = userObj.nickName;
          userRow.avatar = base_img_url + userObj.avatar;

          userList.push(userRow);
        }
        this.storage.set(SESSION_KEY.ALL_USERS, userList);
      }
    });
  }

  ionViewDidLoad() {
   this.initUserList();
  }

  ionViewDidEnter() {
    // this.events.subscribe(EVENTS_KEY.USER_LOGIN, () => {
    //   let currentTab = this.tabRef.getSelected();

    //   this.tabRef.select(currentTab);
    // });
  }

  ionViewWillLeave() {
    // this.events.unsubscribe(EVENTS_KEY.USER_LOGIN);
  }
}
