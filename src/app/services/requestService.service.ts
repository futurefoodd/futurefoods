import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

base_url = environment.apiHost
  constructor() {
  }

  requestHelper(endpoint:string, httpMethod:string, payload?:any){
    let options: RequestInit ={
        method: httpMethod,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    if(httpMethod !=='GET'){options.body = payload}
    console.log( this.base_url+ endpoint)

    return fetch(this.base_url+ endpoint, options )
  }
}
