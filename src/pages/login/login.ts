import { Component } from '@angular/core';
import { NavController, NavParams, App, Events, Tabs} from 'ionic-angular';
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
import { EVENTS_KEY } from '../config/events_key';

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
    private httpService: HttpService, private toastUtils : ToastUtils, private keyboard: Keyboard, private translate: TranslateService,
    public events: Events) {

    this.setDefaultValues();
    this.translate.addLangs(['zh-CN', 'en']);
  }

  ngOnInit() : void {
    this.initFormGroup();
  }

  setDefaultValues() {
    this.storage.get(SESSION_KEY.REMEMBER_USER).then((value) => {
      if (value != null) {
        this.nameValue = value.userName;
        this.psValue = value.password;
        this.checkedUser = true;

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
      this.storage.set(SESSION_KEY.REMEMBER_USER, {"userName": this.loginForm.value.userName, "password": this.loginForm.value.password});
    }

    const userSize = user_list.length;

    for (var i = 0; i < userSize; i++) {
      if (user_list[i].userName === this.loginForm.value.userName && user_list[i].password === this.loginForm.value.password) {
        this.toastUtils.showToast('Login successfully!', 'top');

        this.storage.set(SESSION_KEY.LOGIN_USERNAME, this.loginForm.value.userName);

        this.events.publish(EVENTS_KEY.USER_LOGIN); // refresh page

        this.navCtrl.setRoot(TabsPage);
        // this.navCtrl.parent.select(1);
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
