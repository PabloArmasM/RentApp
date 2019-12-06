import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheDataService {

  static clientId : number;
  static contr : any;
  static open : boolean = false;
  static guindol : any;
  static start = false;

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
    //this.guindol = window.open('file://'+__dirname+'/index.html#/calendario', "", "height=5000, width=5000");
    this.guindol = window.open('http://localhost:4200/#/calendario', "calendario", "fullscreen=yes, height=5000, width=5000");
    this.open = true;
  }


  static closing(){
    this.open = false;
  }

  static couldOpen(){
    if(this.guindol == undefined || this.guindol.closed)
      //this.guindol = window.open('file://'+__dirname+'/index.html#/calendario', "", "height=5000, width=5000");
      this.guindol = window.open('http://localhost:4200/#/calendario');
  }
}
