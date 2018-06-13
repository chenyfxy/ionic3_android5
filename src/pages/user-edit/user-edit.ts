import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { UserModel } from '../model/UserModel';
import { ToastUtils } from '../utils/ToastUtils';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { notBlank } from '../utils/utils';
import { LoginPage } from '../login/login';

/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {

  user: UserModel;
  newUser: boolean = false;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public stroage: Storage,
    public toastUtils: ToastUtils,
    public alertCtrl: AlertController,
    private imagePicker: ImagePicker,
    public navCtrl: NavController
  ) {
    this.newUser = this.params.get('newUser');

    if (this.newUser) {
      this.user = new UserModel();

      this.user.avatar = './assets/imgs/user-unlogin.png';
    } else {
      this.user = this.params.get('loginUser');
    }
  }

  dismiss() {
    if (this.newUser) {
      this.navCtrl.pop()
    } else {
      this.viewCtrl.dismiss();
    }
  }

  choosePhoto() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1
    };

    this.imagePicker.getPictures(options).then((results) => {
      this.user.avatar = results[0];

      this.toastUtils.showToast("Avatar upload successfully!", "top");
    }, (err) => {
      console.log('获取图片失败');
    });
  }

  updateUser() {
    if (notBlank(this.user.userName) && notBlank(this.user.nickName) && notBlank(this.user.password)) {
      if (this.user.userName.length < 4 || this.user.password.length < 4) {
        let alert = this.alertCtrl.create({
          message: "User name and password's length at least 4!",
          buttons: ['OK']
        })
        alert.present();
      } else {
        if (!notBlank(this.user.avatar)) {
          this.user.avatar = './assets/imgs/user-unlogin.png';
        }

        if (this.newUser) {
          this.stroage.get(SESSION_KEY.ALL_USERS).then((userList) => {
            this.user.id = userList[userList.length - 1].id;

            userList.push(this.user);

            this.stroage.set(SESSION_KEY.ALL_USERS, userList);

            this.toastUtils.showToast('Sign in successfully!', 'top');
          })
        } else {
          this.stroage.set(SESSION_KEY.LOGIN_USER, this.user);

          this.toastUtils.showToast('Update user successfully!', 'top');
        }
        this.dismiss();
      }
    } else {
      let alert = this.alertCtrl.create({
        message: "Please input these values!",
        buttons: ['OK']
      })
      alert.present();
    }
  }

}
