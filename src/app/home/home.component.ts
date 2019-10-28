import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuilderCalendarService } from '../builder-calendar.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  count : number = 1;
  mes = {};
  semana1 = {};
  semana2 = {};
  semana3 = {};
  semana4 = {};
  semana5 = {};
  semana6 = {};
  sortMat = [];
  //guindol : any;


  constructor( private router: Router, private calendar : BuilderCalendarService) {}


  amonos(url){
    this.router.navigate([url]);
  }



  /*newWindow(url){
    //this._ipc.send('/lista');
    VERSION ELECTRON
    //this.guindol = window.open('file://'+__dirname+'/index.html#/listas');
    this.guindol = window.open('http://localhost:4200/#/listas');
  }*/

  async ngOnInit() {
    //this.calendar.showTime();
    this.mes = await this.calendar.create(new Date());
    this.prepareOrder();
    this.semana1 = this.semanas(this.mes, 0, 7);
    this.semana2 = this.semanas(this.mes, 7, 14);
    this.semana3 = this.semanas(this.mes, 14, 21);
    this.semana4 = this.semanas(this.mes, 21, 28);
    this.semana5 = this.semanas(this.mes, 28, 35);
    this.semana6 = this.semanas(this.mes, 35);
  }

  /*ngOnDestroy() {
    this.guindol.close();
  }*/

  compare(B){
    B.forEach(element => {
      console.log(this.sortMat.includes(element));
      if(!this.sortMat.includes(element)){
        this.sortMat.push(element);
      }
    });
  }

  prepareOrder(){
    var keys = Object.keys(this.mes);
    keys.forEach(key => {
      this.compare(Object.keys(this.mes[key]));
    });
  }


semanas(datos: any, first:number, last?:number){
  var objeto = {};
  var claves = Object.keys(datos).sort();

  for(var i = first; i < (isNaN(last) ? claves.length: last); i++){
    objeto[claves[i]] = datos[claves[i]];
  }
  return objeto;
}


}
