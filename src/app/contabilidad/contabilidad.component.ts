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

    chachoPuto(){
      var date = new Date();
      var fecha = this.formatDate(this.formatMonth(date));
      this.login.patchValue({fechaSalida : fecha});

      this.data.dayRange({tabla:"contratos", fechaSalida:this.formatMonth(new Date(fecha)).getTime(), fecha:this.formatLast(new Date(fecha)).getTime()}).subscribe(res => {
        this.list = res;
        this.getPrize(res);
        debugger;
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
        debugger;
      });
    }else{
      console.log("three");
    }
    console.log("holi");
  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            matricula : [''],
            fecha : [''],
            fechaSalida: [''],
        });
  }

  ngAfterViewInit(){

    var date = new Date();
    var fecha = this.formatDate(this.formatMonth(date));
    this.login.patchValue({fechaSalida : fecha});

  }

}
