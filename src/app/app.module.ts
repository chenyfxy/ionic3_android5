import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { MyApp } from './app.component';
import { IonicStorageModule  } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { DetailPage } from '../pages/detail/detail';
import { UserEditPage } from '../pages/user-edit/user-edit';
import { MyMessagePage } from '../pages/my-message/my-message';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// manuanlly
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { HttpService } from '../pages/services/HttpService';
import { UserService } from '../pages/services/UserService';
import { ToastUtils } from '../pages/utils/ToastUtils';
import { Http } from '@angular/http';
// import { Keyboard } from '@ionic-native/keyboard';

import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';

import { IonicImageViewerModule } from 'ionic-img-viewer';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';

import { ImagePicker } from '@ionic-native/image-picker';

import { LocalNotifications } from '@ionic-native/local-notifications';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    DetailPage,
    UserEditPage,
    MyMessagePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    DetailPage,
    UserEditPage,
    MyMessagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpService,
    ToastUtils,
    // Keyboard,
    UserService,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    FileChooser,
    CallNumber,
    SocialSharing,
    ImagePicker,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
