import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { MessageModel } from '../model/MessageModel';
import { Storage } from '@ionic/storage';
import { SESSION_KEY } from '../config/session_key';
import { ToastUtils } from '../utils/ToastUtils';
import { EVENTS_KEY } from '../config/events_key';

/**
 * Generated class for the MyMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-message',
  templateUrl: 'my-message.html',
})
export class MyMessagePage {
  messageType: string = "readMessage";
  readMessageList: MessageModel[] = [];
  unreadMessageList: MessageModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage,
    public toast : ToastUtils, public event: Events) {
    this.initMessageList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMessagePage');
  }

  ionViewWillLeave() {
    this.event.publish(EVENTS_KEY.PUSH_MSG);
  }
  
  initMessageList() {
    this.storage.get(SESSION_KEY.MSG_LIST).then(value => {
      let msgList : MessageModel[] = [];

      if (value != null) {
        for (var i in value) {
          let messageRow = new MessageModel();
          messageRow.id = value[i].id;
          messageRow.message = value[i].message;
          messageRow.read = value[i].read;
          messageRow.receiver = value[i].receiver;

          msgList.push(messageRow);
        }
      }

      for (var j in msgList) {
        if (msgList[j].read) {
          this.readMessageList.push(msgList[j]);
        } else {
          this.unreadMessageList.push(msgList[j]);
        }
      }
    });
  }

  markToRead(msgRow) {
    this.storage.get(SESSION_KEY.MSG_LIST).then(value => {
      let msgList : MessageModel[] = value;

      for (var j in msgList) {
        if (msgList[j].id === msgRow.id) {
          msgList[j].read = true;

          this.readMessageList.push(msgRow);

          this.unreadMessageList.splice(this.unreadMessageList.indexOf(msgRow), 1);

          this.toast.showToast('Mark to read', "top");
        }
      }
      this.storage.set(SESSION_KEY.MSG_LIST, msgList);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
