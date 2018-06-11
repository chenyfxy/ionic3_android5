import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { item_list } from '../data/itemData';
import { ItemModel } from '../model/ItemModel';
import { DetailPage } from '../detail/detail';
import { Storage } from '@ionic/storage';
import { SESSION_KEY } from '../config/session_key';
import { user_list } from '../data/userData';
import { sortItem } from '../utils/utils';
import { EVENTS_KEY } from '../config/events_key';

const base_img_src = './assets/imgs/item/';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  allItems: ItemModel[];
  items: ItemModel[];
  isMyItem: boolean = false;
  isMyFa: boolean = false;

  constructor(public navCtrl: NavController, public navParam: NavParams, public storage: Storage, public viewCtrl: ViewController, public events: Events) {
    this.events.subscribe(EVENTS_KEY.REFRESH_HOME, (data) => {
      this.isMyItem = data.isMyItem;
      this.isMyFa = data.isMyFa;
      console.log(this.isMyItem + ", " + this.isMyFa)

      this.initItemList();
    });

    this.events.subscribe(EVENTS_KEY.REFRESH_TAB_PAGE, () => {
      this.initItemList();
      // this.events.unsubscribe(EVENTS_KEY.REFRESH_TAB_PAGE);
    })
  }

  initItemList() {
    this.storage.get(SESSION_KEY.ALL_ITEMS).then(value => {
      if (value != null) {
        this.allItems = value;
      } else {
        this.allItems = [];

        sortItem();

        let size = item_list.length;

        for (var i = 0; i < size; i++) {
          const itemObj = item_list[i];

          let model = new ItemModel();
          model.id = itemObj.id;
          model.title = itemObj.title;
          model.content = itemObj.content;
          model.price = itemObj.price;
          model.phoneNumber = itemObj.phoneNumber;
          model.firstName = itemObj.firstName;
          model.sex = itemObj.sex;
          model.seller = itemObj.seller;
          model.createDate = itemObj.createDate;

          model.imageArray = [];

          for (var imgIndex in itemObj.imageArray) {
            const imgUrl = base_img_src + itemObj.imageArray[imgIndex];
            model.imageArray.push(imgUrl);
          }

          this.allItems.push(model);
        }
        this.storage.set(SESSION_KEY.ALL_ITEMS, this.allItems);
      }
      this.items = this.allItems;

      this.filterMyItemsAndFavorite();
    })
  }

  filterMyItemsAndFavorite() {
    if (this.isMyItem) {
      this.storage.get(SESSION_KEY.LOGIN_USERNAME).then((value) => {
        if (value != null) {
          let myName = '';

          const userSize = user_list.length;

          for (var i = 0; i < userSize; i++) {
            if (user_list[i].userName === value) {
              myName = user_list[i].userName;
              break;
            }
          }

          let size = this.allItems.length;

          const copyItems: ItemModel[] = [];

          for (var j = 0; j < size; j++) {
            if (this.allItems[j].seller === myName) {
              copyItems.push(this.allItems[j]);
            }
          }

          this.allItems = copyItems;
        }
        this.items = this.allItems;
      })
    }

    if (this.isMyFa) {
      this.allItems = [];

      this.storage.get(SESSION_KEY.FAVORITE_ITEMS).then(value => {
        if (value != null) {
          this.allItems = value;
        } else {
          this.allItems = [];
        }
        this.items = this.allItems;
      })
    }
  }

  ionViewDidLoad() {
    
  }

  ionViewWillLeave() {
    this.isMyItem = false;
    this.isMyFa = false;
  }

  getItems(ev: any) {
    let searchText = ev.target.value;

    if (searchText && searchText.trim() != '') {
      this.items = this.allItems.filter((item) => {
        let title = item.title;
        let content = item.content;
        let price = item.price.toString();
        let date = item.createDate;

        if (title.toLowerCase().indexOf(searchText.toLowerCase()) > -1
          || content.toLowerCase().indexOf(searchText.toLowerCase()) > -1
          || price.indexOf(searchText) > -1
          || date.indexOf(searchText) > -1) {
          return true;
        }

        return false;
      })
    } else {
      this.initItemList();
    }
  }

  deleteItem(item) {
    this.items.splice(this.items.indexOf(item), 1);

    this.storage.get(SESSION_KEY.ALL_ITEMS).then(value => {
      if (value != null) {
        let list: ItemModel[] = value;
        let size = list.length;

        list.splice(list.indexOf(item), 1);

        this.storage.set(SESSION_KEY.FAVORITE_ITEMS, list);
      }
    })

    this.storage.get(SESSION_KEY.FAVORITE_ITEMS).then(value => {
      if (value != null) {
        let list: ItemModel[] = value;
        let size = list.length;

        list.splice(list.indexOf(item), 1);

        this.storage.set(SESSION_KEY.FAVORITE_ITEMS, list);
      }
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.initItemList();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.initItemList();
    
    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  gotoDetail(item) {
    let data: Object = {
      item: item,
      dataParam: {
        'isMyItem': this.isMyItem,
        'isMyFa': this.isMyFa
      }
    };
    this.navCtrl.push(DetailPage, data);
  }
}
