import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;


  search = false;
  recibe = false;
  delete = false;

  file = "";
  db: any[] = [];

  tipoPago = "manual";

  login: FormGroup;
  searchForm : FormGroup;

  guindol : any;

  secondsCounter = interval(1000);
  takeFourNumbers = this.secondsCounter.pipe(take(100));
  counterSub : any;

  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            matricula: [''],
            grupo : [''],
            modelo: [''],
            color: [''],
            bastidor: [''],
            propietario: [''],
            situacion: [''],
            fecha: [''],
            gasolina: ['']
        });
      this.searchForm = this.formBuilder.group({
          _id: [''],
          matricula: [''],
          grupo : [''],
          modelo: [''],
      });
  }

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
  }


  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "vehiculos";
    //this.closeSearch();

    this.guindol.postMessage(info, "*");
  }

  deleteElement(){
    this.delete = false;
    var info = { tabla : "vehiculos",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }


  cambio(value){
    this.tipoPago = value;
  }


  select(index){
    this.delete = true;
    this.login.patchValue(this.db[index]);
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.tabla = "vehiculos";
    formData.tipo = this.tipoPago;
    formData.fecha = new Date(formData.fecha).getTime();
    if(!("_id" in formData) || formData._id == '' || formData._id == undefined || formData._id == -1){
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.data.addVehiculeRutine(JSON.stringify({grupo: this.login.value.grupo, matricula : this.login.value.matricula, fecha: this.login.value.fecha})).subscribe(res =>{});
        this.login.patchValue(res);
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }


  formatDate(date){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);



    return (year + "-" + month + "-" + day +"T"+hours+":"+minutes);
  }

  showSearch(){
    if(!this.search){
      this.search = true;
      this.guindol = window.open('http://localhost:4200/#/listaContrato');
      var info = {tabla : 'vehiculos'};
      this.guindol.postMessage(info, "*");

      this.counterSub = this.takeFourNumbers.subscribe(n =>{
        this.guindol.postMessage(n, '*');
        console.log("Mensaje enviado");
        if(n < 1){
          this.guindol.postMessage(info, "*");
        }
        if(n>100){
          console.log(n);
          this.counterSub.unsubscribe();
        }
      });
    }else
      this.onClickSearch();
  }


  closeSearch(){
    this.search = false;
    try{
      this.guindol.close();
      this.counterSub.unsubscribe();
    }catch(err){
      console.log("Ya se ha cerrado");
    }
  }


  ngOnDestroy() {
    try{
      this.guindol.close();
      this.counterSub.unsubscribe();
    }catch(err){
      console.log("Ya se ha cerrado");
    }
  }

  prepareData(data){
    this.delete = true;
    this.readyToPrint = true;
    this.updateCar = true;
    var info = data;
    info.fechaSalida = this.formatDate(new Date(info.fechaSalida));
    info.fechaEntrada = this.formatDate(new Date(info.fechaEntrada));

    this.login.patchValue(info);
  }

  receiveMessage(event)
{
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  /*if (event.origin !== "http://localhost:4200")
    return;*/
  if(event.data.hasOwnProperty('_id')){
    this.counterSub.unsubscribe();
    this.prepareData(event.data);
    this.nuevo = false;
  }

  console.log(event);


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

}
