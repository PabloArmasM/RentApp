import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss']
})
export class ContabilidadComponent implements OnInit {

  selector = "";
  login: FormGroup;
  dias = 0;
  money = 0;
  contratos = 0;
  matricula = "";
  list : any;

  total : number;
  impuesto: number;
  cantidad: number;

  head = {
    clientCode: "Código del cliente",
    grupo : "Grupo",
    intermediario : "Intermediario",
    precio : "Precio"
  }

  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) { }


  getDias(data){
    this.dias = 0;
    this.money = 0;
    this.contratos = data.length;
    data.forEach(element =>{
      var first = this.formatMonth(new Date(element.fechaSalida)).getTime();
      var last = this.formatMonth(new Date(element.fechaEntrada)).getTime();

      this.dias += Math.round(((last - first)/1000)/(3600*24))+1;
      this.money += element.precio;
    });
  }

  getPrize(data){
    this.money = 0;
    data.forEach(element =>{
      this.money += element.precio;
    });
  }

  formatMonth(date){

      var month = ("0" + ((date.getMonth()) + 1)).slice(-2);
      var day = ("0" + ((date.getDate()))).slice(-2);

      return(new Date(date.getFullYear()+"-"+month+"-"+day));


    }

    formatLast(date){
      var month = ("0" + ((date.getMonth()) + 1)).slice(-2);
      var day = ("0" + ((date.getDate()))).slice(-2);
      return(new Date(date.getFullYear()+"-"+month+"-"+day+"T23:59"));

    }


    formatFirst(date){
      var month = ("0" + ((date.getMonth()) + 1)).slice(-2);
      var day = ("0" + ((date.getDate()))).slice(-2);
      return(new Date(date.getFullYear()+"-"+month+"-"+day+"T00:00"));

    }

    chachoPuto(){
      var date = new Date();
      var fecha = this.formatDate(this.formatMonth(date));
      this.login.patchValue({fechaSalida : fecha});

      this.data.dayRange({tabla:"contratos", fechaSalida:this.formatMonth(new Date(fecha)).getTime(), fecha:this.formatLast(new Date(fecha)).getTime()}).subscribe(res => {
        this.list = res;
        this.getPrize(res);

      });

    }

    formatDate(date){
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);



      return (year + "-" + month + "-" + day);
    }

  search(what){
    if(what == 1 && this.login.value.matricula != ''){
      this.matricula = this.login.value.matricula;
      this.data.getData({tabla:"contratos", matricula:this.login.value.matricula}).subscribe(res => {
        console.log(res);
        this.getDias(res);
      });
    }else if(what == 2){
      this.data.dayRange({tabla:"contratos", fechaSalida:this.formatMonth(new Date(this.login.value.fechaSalida)).getTime(), fecha:this.formatLast(new Date(this.login.value.fechaSalida)).getTime()}).subscribe(res => {
        this.list = res;
        this.getPrize(res);

      });
    }else{
      console.log("three");
    }
    console.log("holi");
  }

  getImpuesto(tarifa, impuesto, entrada, salida){
    var dias = (1000*60*60*24);
    var dentro = new Date(entrada).getTime();
    var fuera = new Date(salida).getTime();
    dias = Math.round(Math.abs(fuera - dentro)/dias)
    if(dias == 0){
      dias = 1;
    }

    //this.diasPrint = dias;

    var aCobrar = dias*tarifa;
    aCobrar = (aCobrar * (impuesto/100));
    return aCobrar;
  }


  searchTri(){
    var fechaIni = this.formatFirst(new Date(this.login.value.fechaIni));
    var fechaFin = this.formatLast(new Date(this.login.value.fechaFin));

    var toSearch = {tabla: "contratos", query:{$and:[{fechaSalida : {$gte: fechaIni.getTime()}}, {fechaSalida : {$lte: fechaFin.getTime()}}]}};
    this.data.getData(toSearch).subscribe(res => {

      this.cantidad = res.length;
      var total  = 0 ;
      var impuesto = 0;
      res.forEach(element =>{

        if(element.hasOwnProperty("tarifa")  && element.hasOwnProperty("igic") && element.hasOwnProperty("precio")
            && element["tarifa"] != "" && element["igic"] != "" && element["precio"] != ""){
          impuesto = impuesto + this.getImpuesto(element.tarifa, element.igic, element.fechaEntrada, element.fechaSalida);
          total = total + element.precio;
        }
      });

      this.total = total;
      this.impuesto = impuesto;
    });

  }
  searchBonorl(){
    var fecha: Date;
    if(this.login.value.fechaSalida != "")
      fecha = new Date(this.login.value.fechaSalida);
    else
      fecha = new Date();
  //  var fecha = this.login.value.fechaSalida != "" ? new Date(this.login.fechaSalida) : new Date();
    var fechaIni = this.formatFirst(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
    var fechaFin = this.formatLast(new Date(fecha.getFullYear(),fecha.getMonth()+1,0));
    debugger;
    var toSearch = {tabla: "contratos", query:{$and:[{fechaSalida : {$gte: fechaIni.getTime()}}, {fechaSalida : {$lte: fechaFin.getTime()}}]}};
    this.data.getData(toSearch).subscribe(res => {
      var preview = [];
      res.forEach(element =>{
        if(element.hasOwnProperty("intermediario") && element.intermediario != "")
          preview.push(element);
      });
      this.list = preview;
    });
  }

  putWord(frase, palabra, hueco){
    var start = 0;
    hueco = hueco -1;
    if(hueco > palabra.length){
      start = Math.round((hueco - palabra.length)/2);
    }

    for(var i = 0; i < start; i++)
      frase = frase + " ";
    frase = frase + palabra;
    hueco = hueco - start - palabra.length;
    if(hueco > 0){
      for(var i = 0; i < hueco; i++){
        frase = frase + " ";
      }
    }
    frase +="|";
    return frase;
  }

  goToPrint(){
    var limit = 120;
    //Fecha entrada, fecha salida, fecha reserva, grupo, Lugar, A devolver, Observaciones
    //17 ~ 15
    var print = [];
    var phrase = "|";

     phrase = this.putWord(phrase, "Cantidad", 30); //Palabra, hueco, pos
     phrase = this.putWord(phrase, "Total", 30);
     phrase = this.putWord(phrase, "Impuestos", 30);
      console.log(phrase);
      print.push(phrase);
         phrase = "|";
         phrase = this.putWord(phrase, ""+this.cantidad, 30); //Palabra, hueco, pos
         phrase = this.putWord(phrase, ""+this.total, 30);
         phrase = this.putWord(phrase, ""+this.impuesto, 30);
         print.push(phrase);

    debugger;
    this.data.printReservas({query:print}).subscribe(res =>{
      console.log(res);
    });
  }

  goToPrintLoOtro(){
    var limit = 120;
    //Fecha entrada, fecha salida, fecha reserva, grupo, Lugar, A devolver, Observaciones
    //17 ~ 15
    var print = [];
    var phrase = "|";

     phrase = this.putWord(phrase, "Código cliente", 15); //Palabra, hueco, pos
     phrase = this.putWord(phrase, "Grupo", 30);
     phrase = this.putWord(phrase, "Intermediario", 30);
     phrase = this.putWord(phrase, "precio", 30);

      console.log(phrase);
      print.push(phrase);

      var aux : any = this.list;
      for(var i = 0; i < aux.length; i++){
         phrase = "|";
         phrase = this.putWord(phrase, ""+aux[i].clientCode, 15);
         phrase = this.putWord(phrase, aux[i].grupo, 30); //Palabra, hueco, pos
         phrase = this.putWord(phrase, aux[i].numHotel, 30);
         phrase = this.putWord(phrase, aux[i].precio, 19);
         print.push(phrase);
      }

      debugger;
    this.data.printReservas({query:print}).subscribe(res =>{
      console.log(res);
    });
  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            matricula : [''],
            fecha : [''],
            fechaSalida: [''],
            fechaIni: [''],
            fechaFin:['']
        });
  }

  ngAfterViewInit(){

    var date = new Date();
    var fecha = this.formatDate(this.formatMonth(date));
    this.login.patchValue({fechaSalida : fecha});

  }

}
