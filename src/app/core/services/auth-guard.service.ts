import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { catchError, map } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { IConfiguration } from '../configuration/index';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  _url : string;
  constructor(
    private httpClient: HttpClient, 
    public router: Router, 
    private config: IConfiguration,
    private commonService: CommonService) {
  }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean>{
    return this.httpClient.get(this.config.api.base + this.config.api.authenticationURL, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
      responseType: 'text'
    }).pipe(
      map((data) => {
        // debugger;
        if(data !== undefined){
          let name = data.split('-')[1];
          name = name.charAt(0).toUpperCase() + name.slice(1, name.length-1);
          this.commonService.setName(name);
          localStorage.setItem('name', name);
          this.commonService.hideLoader(true);
          return true;
        } else {
          this.commonService.hideLoader(true);
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }),
      catchError((error) => {
        this.commonService.hideLoader(true);
        this.router.navigate(['/unauthorized']);
        return Observable.throw(error);
      })
    );
  }

  // private catchError(error){
    
  // }
}
