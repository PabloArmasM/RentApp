import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheDataService {

  static clientId : number;
  static contr : any;
  static open : boolean = false;
  static guindol : any;

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


  static setContrato(contr){
    this.contr = contr;
  }

  static getContrato(){
    return this.contr;
  }

  static itsOpen(){
    return this.open;
  }

  static opening(){
    this.guindol = window.open('http://localhost:4200/#/calendario');
    this.open = true;
  }


  static closing(){
    this.open = false;
  }

  static couldOpen(){
    console.log(this.guindol.closed);
    if(this.guindol.closed)
      this.guindol = window.open('http://localhost:4200/#/calendario');
  }
}
