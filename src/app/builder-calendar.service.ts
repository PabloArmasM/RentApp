import { Injectable } from '@angular/core';
import { DatProviderService } from './dat-provider.service';
import {Observable} from 'rxjs/Observable'



@Injectable({
  providedIn: 'root'
})
export class BuilderCalendarService {

  constructor(private data : DatProviderService) { }

  showTime(){

    ///IMPORTANTE:
    //primer Día: console.log((new Date(AAAA, M, 1)).getDay());
    //Ultimo dia: console.log((new Date(AAAA, M + 1,  0)).getDay());
    //Cantidad de días: console.log((new Date(AAAA, M + 1,  0)).getDate());
    //Cantidad de semanas  var semanas= Math.ceil(((new Date(2019, 8+1,0).getDate())+(((new Date(2019, 8, 1).getDay()-1)%7+7)%7))/7);
    //fecha para los días anteriores: new Date(AAA, M, 1 - Dia).getTime() MILLIS
    //fecha para los días posteriores: new Date(AAA, M+1, 0 + (6 - DiaFinal))




    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    console.log("El día de hoy es: ");
    console.log(day);

    var today = new Date("01-07-2019");
    console.log(today.getMonth());
    console.log(today.getFullYear());
    console.log("El primer día cayó un:");
    console.log((new Date(2019, 8, 1)).getDay());
    var semanas= Math.ceil(((new Date(2019, 8+1,0).getDate())+(((new Date(2019, 8, 1).getDay()-1)%7+7)%7))/7);
    console.log("fleje de modulo 7");
    console.log((((new Date(2019, 8, 1).getDay()-1)%7+7)%7));
    console.log("Este mes tiene tantas semanas:");
    console.log(semanas);
    console.log("El último día cayó un:");
    console.log((new Date(2019, 8 + 1,  0)).getDay());

  }


  async create(fecha, grupo){
    var mes: Array<any> = [];

    console.log("Primer dia segun el calendario occidental");
    var year = fecha.getFullYear();
    var month = fecha.getMonth();

    var convert = ((new Date(year, month, 1).getDay()-1)%7+7)%7;

    var empieza = new Date(year, month, 1 - convert);
    var diaStart = empieza.getDate();
    var mesStart = month;
    if(diaStart > 1)
      mesStart--;
    var diasExtras = 0;


    var diaFinal = new Date(year, month+1,  0).getDay();

    var semanas= Math.ceil(((new Date(year, month+1,0).getDate())+(((new Date(year, month, 1).getDay()-1)%7+7)%7))/7);
    console.log("semanas: "+semanas);
    if(semanas < 6)
      diasExtras = 7;

    var termina = new Date(year, month+1, diasExtras + (7 - diaFinal));
    var i = 0;


    var myPromise = (fechaIni, fechaFin) => {
       return new Promise((resolve, reject) => {
            this.data.getVehicleStatus({grupo : grupo, fechaInicial : fechaIni, fechaFinal : fechaFin}).subscribe(res=>{
              if(res < 0 ) reject(0);
              resolve(res);
              console.log("Primeee")});
       });
     };


    //while(empieza.getTime() < termina.getTime()){
      //empieza = new Date(year, mesStart, diaStart + i++);
      var result = await myPromise(empieza.getTime(), termina.getTime());
      /*while(empieza.getTime() < termina.getTime()){
        var middle = {};
        empieza = new Date(year, mesStart, diaStart + i++);
        middle.dia = empieza.getDate();
        debugger;
        middle.array = result.filter(function (el) {
              return el.fecha == empieza.getTime();
         });
        mes.push(middle);
      }*/

    console.log("empieza el: "+empieza);
    console.log("termina el: "+termina);
    return result;
    //var semanas= Math.ceil(((new Date(fecha.getFullYear(), fecha.getMonth()+1,0).getDate())+(((new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay()-1)%7+7)%7))/7);
    //console.log("Semanas totales");
    //console.log(semanas);
  }
}
