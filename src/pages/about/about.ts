import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { LoginPage } from '../login/login'
import { ItemModel } from '../model/ItemModel';
import { SESSION_KEY } from '../config/session_key';

import { ToastUtils } from '../utils/ToastUtils';

// import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
// import { Camera } from '@ionic-native/camera';
// import { FileChooser } from '@ionic-native/file-chooser';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { Storage } from '@ionic/storage';
import { user_list } from '../data/userData';
import { formatDate, notBlank } from '../utils/utils';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { EVENTS_KEY } from '../config/events_key';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  item: ItemModel = new ItemModel();
  path: any;
  fileName: any;
  images: string[] = [];
  man: boolean = false;
  loginUserName: any;
  hasLogin: boolean = false;

  constructor(public navCtrl: NavController, private toastUtils: ToastUtils, private storage: Storage,
    private imagePicker: ImagePicker, private alertCtrl: AlertController, public events: Events) {

  }

  ionViewDidEnter() {
    console.log("did enter page about")
    let data = {
      'isMyItem': false,
      'isMyFa': false
    }
    this.events.publish(EVENTS_KEY.REFRESH_HOME, data);

    this.initDatas();
  }

  ionViewWillLeave() {
    console.log("leave page about")
  }

  initDatas() {
    this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
      if (value != null) {
        const userSize = user_list.length;

        for (var i = 0; i < userSize; i++) {
          if (user_list[i].userName === value) {
            this.loginUserName = user_list[i].userName;
            break;
          }
        }
        this.hasLogin = true;
      } else {
        this.hasLogin = false;
      }
    });
    this.item = new ItemModel();
    this.item.title = "";
    this.item.content = "";
    this.item.price = null;
    this.item.phoneNumber = null;
    this.item.firstName = "";
    this.item.imageArray = this.images;

    this.images = [];
    this.man = false;
  }

  choosePhoto() {
    // const options = {
    //   quality: 50,
    //   sourceType: 0,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   this.images.push(imageData);

    //   this.toastUtils.showToast("Image upload successfully!", "top");
    // }, (err) => {
    //   this.toastUtils.showToast("picture error:" + err, "top");
    // })

    const options: ImagePickerOptions = {
      maximumImagesCount: 3
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.images.push(results[i]);
      }

      this.toastUtils.showToast("Image upload successfully!", "top");
    }, (err) => {
      console.log('获取图片失败');
    });
  }

  publish() {
    this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((data) => {

      if (data != null) {
        if (notBlank(this.item.title) && notBlank(this.item.content) && this.images.length > 0 && this.item.price != null && this.item.phoneNumber != null && notBlank(this.item.firstName)) {
          this.storage.get(SESSION_KEY.ALL_ITEMS).then(value => {
            if (value != null) {
              let list: ItemModel[] = value;

              this.item.id = list[0].id + 1;
              this.item.imageArray = this.images;
              this.item.sex = this.man ? "Mr" : "Mrs";
              this.item.seller = this.loginUserName;
              this.item.createDate = formatDate(new Date());

              list.unshift(this.item);

              this.storage.set(SESSION_KEY.ALL_ITEMS, list);

              this.toastUtils.showToast('Publish successfully!', 'top');

              this.navCtrl.parent.select(0);
            }
          })
        } else {
          let alert = this.alertCtrl.create({
            message: "Please input these values!",
            buttons: ['OK']
          })
          alert.present();
        }

      } else {
        this.navCtrl.push(LoginPage);
      }

    });
  }
}
