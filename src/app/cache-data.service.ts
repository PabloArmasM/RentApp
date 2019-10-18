import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheDataService {

  static clientId : number;

  constructor() { }

  static setClientId(id){
    this.clientId = id;
  }

  static getClientId(){
    return this.clientId;
  }

  clean(data){
    var cleanData = data;
    for(var key in cleanData){
      if (cleanData[key] === null || cleanData[key] === undefined || cleanData[key] === "")
          delete cleanData[key];
    }
    return cleanData;
  }

}
