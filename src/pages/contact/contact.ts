import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { LoginPage } from '../login/login';
import { UserService } from '../services/UserService';
import { Storage } from '@ionic/storage';
import { user_list } from '../data/userData';
import { HomePage } from '../home/home';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EVENTS_KEY } from '../config/events_key';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [UserService]
})
export class ContactPage {
  userNickName: any;
  userAvatar: any;
  result: any;

  constructor(public navCtrl: NavController, private userService: UserService, public storage: Storage,
  public callNumber: CallNumber, private alertCtrl: AlertController, private sharing: SocialSharing, public modalCtrl: ModalController,
  public events: Events) {

    this.initDatas();

    this.events.subscribe(EVENTS_KEY.REFRESH_TAB_PAGE, () => {
      console.log("comeh ere")
      this.initDatas();
    });
  }

  ionViewDidLoad() {
    
  }

  initDatas() {
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
              if (user_list[i].userName === value) {
                this.userAvatar = user_list[i].avatar;
                this.userNickName = user_list[i].nickName;
                console.log("userAvatar:" + this.userAvatar);
                break;
              }
            }
          } else {
            //this.navCtrl.setRoot(LoginPage);
          }
    //     )
    //   }
    })
  }

  gotoHome(isFav) {
    let myItem = !isFav;
    let myFav = isFav;

    let data = {
      'isMyItem': myItem,
      'isMyFa': myFav
    }
    this.events.publish(EVENTS_KEY.REFRESH_HOME, data);

    // let modal = this.modalCtrl.create(HomePage, data);
    // modal.present();
    this.navCtrl.parent.select(0);
    // this.navCtrl.push(HomePage, data);
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
