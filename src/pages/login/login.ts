import { Component } from '@angular/core';
import { NavController, NavParams, App} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from "../services/HttpService";
import { Storage } from '@ionic/storage';
import { ToastUtils } from '../utils/ToastUtils';
import { Keyboard } from '@ionic-native/keyboard';
import { SESSION_KEY } from '../config/session_key';
import { SERVER_URL } from '../config/url_config';
import { TranslateService } from 'ng2-translate';
import { TabsPage } from '../tabs/tabs';
import { user_list } from '../data/userData';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [HttpService, ToastUtils]
})
export class LoginPage {
  public loginForm: FormGroup;
  userName: any;
  password: any;
  nameValue : any;
  psValue : any;
  checkedUser : any;
  pwshow: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private formBuilder: FormBuilder,
    private httpService: HttpService, private toastUtils : ToastUtils, private keyboard: Keyboard, private translate: TranslateService) {

    this.setDefaultValues();
    this.translate.addLangs(['zh-CN', 'en']);
  }

  ngOnInit() : void {
    this.initFormGroup();
  }

  ionViewDidLoad() {
    let elem = document.querySelectorAll(".tabbar");

    if (elem != null) {
      Object.keys(elem).map((key) => {
        elem[key].style.display ='none';
      });
    }
  }

  ionViewWillLeave(){
    let elem = document.querySelectorAll(".tabbar");

    if (elem != null) {
      Object.keys(elem).map((key) => {
        elem[key].style.display ='flex';
      });
    }
  }

  setDefaultValues() {
    this.storage.get(SESSION_KEY.LOGIN_USER).then((value) => {
      if (value != null) {
        this.nameValue = value.userName;
        this.psValue = value.password;
        this.checkedUser = true;
        console.log("newValue0:" + this.nameValue);

        this.initFormGroup();
      }
    });
  }

  initFormGroup() {
    console.log("nameValue:", this.nameValue);
    this.loginForm = this.formBuilder.group({
      userName: [this.nameValue, Validators.compose([Validators.minLength(4), Validators.required])],
      password: [this.psValue, Validators.compose([Validators.required, Validators.minLength(4)])],
      checkedUser:[this.checkedUser]
    });
    this.userName = this.loginForm.controls["userName"];
    this.password = this.loginForm.controls["password"];
  }

  showOrHidePass() {
    console.log("log here")
    this.keyboard.close();

    this.pwshow = !this.pwshow;
  }

  loginClick(_event) {
    _event.preventDefault();

    if (this.loginForm.value.checkedUser) {
      this.storage.set(SESSION_KEY.LOGIN_USER, {"userName": this.loginForm.value.userName, "password": this.loginForm.value.password});
    }

    const userSize = user_list.length;

    for (var i = 0; i < userSize; i++) {
      if (user_list[i].userName === this.loginForm.value.userName && user_list[i].password === this.loginForm.value.password) {
        this.toastUtils.showToast('Login successfully!', 'top');

        this.storage.set(SESSION_KEY.LOGIN_USERNAME, this.loginForm.value.userName);

        // this.appCtrl.getRootNav().push(TabsPage);
        this.navCtrl.parent.select(0);
      }
    }

//     this.httpService.login(SERVER_URL.LOGIN_URL, JSON.stringify(this.loginForm.value)).subscribe(
//       data => {
//         this.toastUtils.showToast(data.msg, 'top');
// console.log("login:"+ data);
//         if (data.result != null) {
//           this.storage.set(SESSION_KEY.LOGIN_USERNAME, this.loginForm.value.userName);

//           this.navCtrl.pop();
//         }
//       },
//       err => {
//         console.log('err');
//       }
//     )
  };
}
