import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { SESSION_KEY } from '../config/session_key';
import { Storage } from '@ionic/storage';
import { UserModel } from '../model/UserModel';
import { ToastUtils } from '../utils/ToastUtils';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

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
  
    constructor(
      public params: NavParams,
      public viewCtrl: ViewController,
      public stroage: Storage,
      public toastUtils: ToastUtils,
      public alertCtrl: AlertController,
      private imagePicker: ImagePicker
    ) {
        console.log("com here user");
      this.user = this.params.get('loginUser');
    }
  
    dismiss() {
      this.viewCtrl.dismiss();
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
      if (this.user.nickName != "" && this.user.password != "" && this.user.avatar != "") {
        this.stroage.set(SESSION_KEY.LOGIN_USER, this.user);
  
        this.toastUtils.showToast('Update user successfully!', 'top');
  
        this.dismiss();
      } else {
        let alert = this.alertCtrl.create({
          message: "Please input these values!",
          buttons: ['OK']
        })
        alert.present();
      }
    }

}
