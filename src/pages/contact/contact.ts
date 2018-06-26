import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EVENTS_KEY } from '../config/events_key';
import { UserModel } from '../model/UserModel';
import { UserEditPage } from '../user-edit/user-edit';
import { MyMessagePage } from '../my-message/my-message';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  loginUser: UserModel = new UserModel();
  hasLogin: boolean = false;

  constructor(public navCtrl: NavController, public storage: Storage,
    public callNumber: CallNumber, private alertCtrl: AlertController, private sharing: SocialSharing, public modalCtrl: ModalController,
    public events: Events) {

  }

  ionViewDidEnter() {
    console.log("DidEnter page contact")
    let data = {
      'isMyItem': false,
      'isMyFa': false
    }
    this.events.publish(EVENTS_KEY.REFRESH_HOME, data);

    this.initDatas();
  }

  ionViewWillLeave() {
    console.log("leave page contact")
    this.events.publish(EVENTS_KEY.PUSH_MSG);
  }

  initDatas() {
    this.storage.get(SESSION_KEY.LOGIN_USER).then((userObj) => {
      if (userObj == null) {
        this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
          if (value != null) {
            this.storage.get(SESSION_KEY.ALL_USERS).then(userList => {
            // this.userService.getUserByName(value).then(
            //   data => {
            //     this.result = JSON.parse(JSON.stringify(data));
            //     console.log(this.result)
            //     this.userAvatar = this.result.avatar;
            //     this.userNickName = this.result.nickName;
            //   }).
            //   catch(err => {
            for (var index in userList) {
              let userObj = userList[index];

              if (userObj.userName === value) {
                this.loginUser = userObj;
                break;
              }
            }

            this.storage.set(SESSION_KEY.LOGIN_USER, this.loginUser);

            this.hasLogin = true;
          });
          } else {
            //this.navCtrl.setRoot(LoginPage);
            this.loginUser = new UserModel();
            this.hasLogin = false;
          }
          //     )
          //   }
          
        })
      } else {
        this.loginUser = userObj;
        this.hasLogin = true;
      }
    });
  }

  openModal() {
    let modal = this.modalCtrl.create(UserEditPage, { loginUser: this.loginUser });
    modal.present();
  }

  openMessage() {
    let modal = this.modalCtrl.create(MyMessagePage);
    modal.present();
  }

  gotoHome(isFav) {
    let myItem = !isFav;
    let myFav = isFav;

    let data = {
      'isMyItem': myItem,
      'isMyFa': myFav
    }
    this.events.publish(EVENTS_KEY.REFRESH_HOME, data);

    this.navCtrl.parent.select(0);
  }

  shareItem() {
    this.sharing.shareViaEmail('Ionic', 'Ionic shop', ['chenyfxy@hotmail.com']).then(() => {

    }).catch(err => { console.log('sharing error:' + err) })
  }

  callPhone() {
    this.callNumber.callNumber("123456", true).then(res => {
      console.log('Launched dialer!', res)
    }).catch(err => console.log('Error launching dialer', err))
  }

  clearStorage() {
    this.storage.clear();

    let alert = this.alertCtrl.create({
      message: "Clear cache successfully!",
      buttons: ['OK']
    })
    alert.present();

    this.gotoLogin();
  }

  showAbout() {
    let alert = this.alertCtrl.create({
      title: "About us",
      message: "Version V1.0<br/>Date 2018/6/7",
      buttons: ['OK']
    })
    alert.present();
  }

  gotoLogin() {
    this.navCtrl.push(LoginPage);
  }

  logout() {
    this.storage.remove(SESSION_KEY.LOGIN_USER);
    this.storage.remove(SESSION_KEY.LOGIN_USERNAME);
    
    this.gotoLogin();
  }
}