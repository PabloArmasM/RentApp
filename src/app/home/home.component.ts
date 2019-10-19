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


  constructor(private router: Router, private calendar : BuilderCalendarService) { }

  amonos(url){
    this.router.navigate([url]);
  }

  newWindow(url){
    var newWindow = window.open(url);  
  }

  async ngOnInit() {
    //this.calendar.showTime();
    this.mes = await this.calendar.create(new Date());
    this.semana1 = this.semanas(this.mes, 0, 7);
    this.semana2 = this.semanas(this.mes, 7, 14);
    this.semana3 = this.semanas(this.mes, 14, 21);
    this.semana4 = this.semanas(this.mes, 21, 28);
    this.semana5 = this.semanas(this.mes, 28, 35);
    this.semana6 = this.semanas(this.mes, 35);
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
