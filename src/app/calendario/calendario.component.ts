import { Component, OnInit } from '@angular/core';
import { BuilderCalendarService } from '../builder-calendar.service';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  mes = {};
  semanasV = [];
  sortMat = [];

  constructor( private calendar : BuilderCalendarService) { }

  async ngOnInit() {
    //this.calendar.showTime();
    this.mes = await this.calendar.create(new Date());
    this.prepareOrder();
    this.semanasV.push(this.semanas(this.mes, 0, 7));
    this.semanasV.push(this.semanas(this.mes, 7, 14));
    this.semanasV.push(this.semanas(this.mes, 14, 21));
    this.semanasV.push(this.semanas(this.mes, 21, 28));
    this.semanasV.push(this.semanas(this.mes, 28, 35));
    this.semanasV.push(this.semanas(this.mes, 35));
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
    var matriculas = {};
    this.sortMat.forEach(mat =>{
      matriculas[mat] = Object.keys(datos[claves[i]]).includes(mat) ? datos[claves[i]][mat] : -1;
    });
    objeto[claves[i]] = matriculas;
  }
  return objeto;
}

}
