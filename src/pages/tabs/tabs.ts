import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Tabs, Tab, NavController, Events } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { user_list } from '../data/userData';
import { UserModel } from '../model/UserModel';
import { MessageModel } from '../model/MessageModel';
import { message_list } from '../data/messageData';
import { EVENTS_KEY } from '../config/events_key';

const base_img_url = './assets/imgs/';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  tabRoots: Object[];
  msgBadge: any = null;

  constructor(private storage: Storage, private navCtrl: NavController, public events: Events) {
    this.tabRoots = [{ root: HomePage, tabTitle: 'home', tabIcon: 'home', hasBadge: false},
    { root: AboutPage, tabTitle: 'publish', tabIcon: 'add-circle', hasBadge: false },
    { root: ContactPage, tabTitle: 'personal', tabIcon: 'person', hasBadge: true }];
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

  initMsgList() {
    this.storage.get(SESSION_KEY.MSG_LIST).then(value => {
      let msgList : MessageModel[] = [];
      
      if (value == null) {
        for (var index in message_list) {
            let messageRow = new MessageModel();
            messageRow.id = message_list[index].id;
            messageRow.message = message_list[index].message;
            messageRow.read = message_list[index].read;
            messageRow.receiver = message_list[index].receiver;
    
            msgList.push(messageRow);
        }
        this.storage.set(SESSION_KEY.MSG_LIST, msgList);
      }

      this.countMsg();
    });
  }

  ionViewDidLoad() {
   this.initUserList();

   this.initMsgList();
  }

  ionViewDidEnter() {
    this.events.subscribe(EVENTS_KEY.PUSH_MSG, () => {
      this.countMsg();
    });
  }

  countMsg() {
    this.storage.get(SESSION_KEY.MSG_LIST).then(value => {
      if (value == null) {
        this.msgBadge = null
      } else {
        this.msgBadge = 0;
        let msgList : MessageModel[] = value;
        
        for (var index in msgList) {
          if (!msgList[index].read) {
            this.msgBadge ++;
          }
        }
      }
    })
  }

  ionViewWillLeave() {
  }
}
