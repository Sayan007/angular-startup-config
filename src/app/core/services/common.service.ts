import { Injectable, EventEmitter, Output } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { IConfiguration } from '../configuration/index';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @Output() getName = new EventEmitter();
  @Output() loaderStatus = new EventEmitter();
  _url : string;
  constructor(private httpClient: HttpClient, private router: Router, private config: IConfiguration) {}
  
  hideLoader(data: boolean){
    this.loaderStatus.emit(data);
  }

  setName(name: string){
    this.getName.emit(name);
  }

  /**
   * Setting up a cookie
   * @param cookieName Cookie name
   * @param cookieValue Cookie value
   */
  setCookie(cookieName: string, cookieValue: any) { 
    var d = new Date();
    d.setTime(d.getTime() + (2 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    // For qa or dev server
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    // document.cookie = cookieName + "=" + cookieValue + ";" + expires;
  }

  /**
   * Fetching cookie
   * @param name Cookie name
   */
  getCookie(name: string) {
    const userGobalObj= {
      userId:"userId", 
      access_token:"access_token",
      role:"role", 
      name:"name", 
      applications:"applications", 
      username:"username"
    };
    var found = Object.keys(userGobalObj).filter(function(key) {
      return userGobalObj[key] === name;
    });
    if (found.length) {
      var cookieName = name + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var allCookies = decodedCookie.split(';');
      for (var i = 0; i < allCookies.length; i++) {
        var singleCookie = allCookies[i].trim();
        if (singleCookie.length > 0) {
          if (singleCookie.indexOf(cookieName) == 0) {
            return singleCookie.substring(cookieName.length, singleCookie.length);
          }
        }
      }
      return null;
    }
  }
}
