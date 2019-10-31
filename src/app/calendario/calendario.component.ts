import { Component, OnInit } from '@angular/core';
import { BuilderCalendarService } from '../builder-calendar.service';
import { CacheDataService } from '../cache-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  mes = {};
  semanasV = [];
  sortMat = [];
  login: FormGroup;
  grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  fecha = new Date();
  grupo  = "A";

  constructor(private formBuilder: FormBuilder, private calendar : BuilderCalendarService) { }

  ngOnInit() {
    this.login = this.formBuilder.group({
            fecha : ['']
        });
    this.createCalendar(this.fecha, this.grupo);
  }

  ngAfterViewInit(){
    var date = new Date();
    var fecha = this.formatDate(date);
    this.login.patchValue({fecha : fecha});
  }

  formatDate(date){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return (year + "-" + month + "-" + day);
  }

  updateMonth(update){
      if(update == 0)
        this.fecha = new Date();
      else
        this.fecha = new Date(this.fecha.getFullYear(), this.fecha.getMonth()+update, 1);
      this.semanasV=[];
      this.login.patchValue({fecha : this.formatDate(this.fecha)});
      this.createCalendar(this.fecha, this.grupo);
  }


  changeMonth(){
    this.fecha = new Date(this.login.value.fecha)
    this.semanasV = [];
    this.createCalendar(this.fecha, this.grupo);
  }

  changeGroup(event){
    this.semanasV = [];
    this.grupo = event.value;
    this.createCalendar(this.fecha, this.grupo);
  }

  async createCalendar(date, grupo){
    this.mes = await this.calendar.create(date, grupo);
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
