import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events, NavParams } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { LoginPage } from '../login/login';
import { UserService } from '../services/UserService';
import { Storage } from '@ionic/storage';
import { user_list } from '../data/userData';
import { HomePage } from '../home/home';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EVENTS_KEY } from '../config/events_key';
import { UserModel } from '../model/UserModel';
import { UserEditPage } from '../user-edit/user-edit';

const base_img_url = './assets/imgs/';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [UserService]
})
export class ContactPage {
  loginUser: UserModel = new UserModel();

  constructor(public navCtrl: NavController, private userService: UserService, public storage: Storage,
  public callNumber: CallNumber, private alertCtrl: AlertController, private sharing: SocialSharing, public modalCtrl: ModalController,
  public events: Events) {

  }

  ionViewDidEnter(){
    let data = {
      'isMyItem': false,
      'isMyFa': false
    }
    this.events.publish(EVENTS_KEY.REFRESH_HOME, data); 

    this.initDatas();
  }

  ionViewWillLeave() {
    console.log("leave page contact")
  }

  initDatas() {
    this.storage.get(SESSION_KEY.LOGIN_USER).then((userObj) => {
      if (userObj == null) {
        this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
          if (value != null) {
            // this.userService.getUserByName(value).then(
            //   data => {
            //     this.result = JSON.parse(JSON.stringify(data));
            //     console.log(this.result)
            //     this.userAvatar = this.result.avatar;
            //     this.userNickName = this.result.nickName;
            //   }).
            //   catch(err => {
                const userSize = user_list.length;
    
                for (var i=0; i<userSize; i++) {
                  let userObj = user_list[i];
    
                  if (userObj.userName === value) {
                    this.loginUser.id = userObj.id;
                    this.loginUser.userName = user_list[i].userName;
                    this.loginUser.password = user_list[i].password;
                    this.loginUser.nickName = user_list[i].nickName;
                    this.loginUser.avatar = base_img_url + user_list[i].avatar;
                    break;
                  }
                }
    
                this.storage.set(SESSION_KEY.LOGIN_USER, this.loginUser);
              } else {
                //this.navCtrl.setRoot(LoginPage);
              }
        //     )
        //   }
        })
      } else {
        this.loginUser = userObj;
      }
    });
  }

  openModal() {
    console.log("open user");
    let modal = this.modalCtrl.create(UserEditPage, {loginUser: this.loginUser});
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

    }).catch(err => {console.log('sharing error:' + err)})
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

    this.navCtrl.setRoot(LoginPage);
  }

  showAbout() {
    let alert = this.alertCtrl.create({
      title: "About us",
      message: "Version V1.0<br/>Date 2018/6/7",
      buttons: ['OK']
    })
    alert.present();
  }

  logout() {
    this.storage.remove(SESSION_KEY.LOGIN_USERNAME);
    this.navCtrl.setRoot(LoginPage);
  }
}