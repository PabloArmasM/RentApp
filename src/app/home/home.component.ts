import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheDataService } from '../cache-data.service';






@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  count : number = 1;
  guindol : any;

  //guindol : any;


  constructor( private router: Router) {}


  amonos(url){
    this.router.navigate([url]);
  }

  ngOnInit(){
    if(CacheDataService.itsOpen()){
      window.open('http://localhost:4200/#/calendario');
      CacheDataService.opening();
    }
    //window.open('file://'+__dirname+'/index.html#/calendario');
  }

  /*newWindow(url){
    //this._ipc.send('/lista');
    VERSION ELECTRON
    //this.guindol = window.open('file://'+__dirname+'/index.html#/listas');
    this.guindol = window.open('http://localhost:4200/#/listas');
  }*/


}
