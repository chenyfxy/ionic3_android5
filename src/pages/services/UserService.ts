import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { SERVER_URL } from "../config/url_config";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {

  }

  getUserByName(userName) {
    console.log("username:" + userName)
    return this.http.get(SERVER_URL.USER_URL + "/" + userName).toPromise()
    .then(res => res)
    .catch(err => {
    });
  }
}
