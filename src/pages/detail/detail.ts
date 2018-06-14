import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, Navbar, Events} from 'ionic-angular';
import { ItemModel } from '../model/ItemModel';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastUtils } from '../utils/ToastUtils';
import { Storage } from '@ionic/storage';
import { SESSION_KEY } from '../config/session_key';
import { TabsPage } from '../tabs/tabs';
import { EVENTS_KEY } from '../config/events_key';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  item: ItemModel;
  images: string[];
  showStar: boolean = false;
  dataParam: any;

  constructor(public navParams: NavParams, private callNumber: CallNumber, private sharing: SocialSharing,
  private toastUtils: ToastUtils, private storage: Storage, public navCtrl: NavController, public events: Events) {
    this.item = new ItemModel();
    this.item = this.navParams.get('item');
    this.dataParam = this.navParams.get('dataParam');

    this.images = this.item.imageArray;

    this.checkStar();
  }

  ionViewDidLoad() {
    let elem = document.querySelectorAll(".tabbar");

    if (elem != null) {
      Object.keys(elem).map((key) => {
        elem[key].style.display ='none';
      });
    }

    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick(e: UIEvent) {
    // this.navCtrl.pop();
    this.navCtrl.setRoot(TabsPage);
  }

  ionViewWillLeave(){
    let elem = document.querySelectorAll(".tabbar");

    if (elem != null) {
      Object.keys(elem).map((key) => {
        elem[key].style.display ='flex';
      });
    }

    this.events.publish(EVENTS_KEY.REFRESH_HOME, this.dataParam);
    console.log("leave detail page")
    // this.navCtrl.setRoot(TabsPage);
  }

  checkStar() {
    this.showStar = false;

    this.storage.get(SESSION_KEY.FAVORITE_ITEMS).then(value => {
      if (value != null) {
        let list : ItemModel[] = value;
        let size = list.length;

        for (var i = 0; i < size; i++) {
          if (list[i].id === this.item.id) {
            this.showStar = true;
            break;
          }
        }
      }
    });
  }

  saveMyFavorite() {
    this.storage.get(SESSION_KEY.FAVORITE_ITEMS).then(value => {
      let itemList: ItemModel[] = [
      ];
      if (value != null) {
        itemList = value;
      }
      itemList.unshift(this.item);
      this.storage.set(SESSION_KEY.FAVORITE_ITEMS, itemList);
      this.toastUtils.showToast('Save to my favorite successfully!', 'top');

      this.showStar = true;

      this.storage.get(SESSION_KEY.MSG_BADGE).then(badgeVal => {
        if (badgeVal == null) {
          badgeVal = 0;
        }
        badgeVal ++;

        this.storage.set(SESSION_KEY.MSG_BADGE, badgeVal);
      })
    });
  }

  removeMyFavorite() {
    this.storage.get(SESSION_KEY.FAVORITE_ITEMS).then(value => {
      if (value != null) {
        let list : ItemModel[] = value;
        let size = list.length;
        
        list.splice(list.indexOf(this.item), 1);

        this.storage.set(SESSION_KEY.FAVORITE_ITEMS, list);
      }
      this.toastUtils.showToast('Cancel my favorite successfully!', 'top');

      this.showStar = false;

      this.storage.get(SESSION_KEY.MSG_BADGE).then(badgeVal => {
        if (badgeVal != null) {
          badgeVal --;

          this.storage.set(SESSION_KEY.MSG_BADGE, badgeVal);
        }
      })
    });
  }

  shareItem() {
    this.sharing.shareViaEmail('Ionic', 'Ionic shop', ['chenyfxy@hotmail.com']).then(() => {

    }).catch(err => {console.log('sharing error:' + err)})
  }

  callPhone() {
    this.callNumber.callNumber(this.item.phoneNumber.toString(), true).then(res => {
      console.log('Launched dialer!', res)
    }).catch(err => console.log('Error launching dialer', err))
  }
}
