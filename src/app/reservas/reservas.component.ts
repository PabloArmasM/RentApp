import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { ThermalPrinterService } from '../thermal-printer.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;


  login: FormGroup;
  searchForm : FormGroup;
  submitted = false;
  tipoPago = "efectivo";
  listaPor = "reservas";

  file = "";
  search = false;
  recibe = false;
  updateCar = false;
  delete = false;
  readyToPrint = false;


  db: any[] = [];

  guindol : any;

  secondsCounter = interval(1000);
  takeFourNumbers = this.secondsCounter.pipe(take(100));
  counterSub : any;

  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};


  constructor(private formBuilder: FormBuilder, private cache : CacheDataService, private data: DatProviderService, private printer: ThermalPrinterService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            clientCode: [''],
            grupo: [''],
            operador: [''],
            sucursal: [''],
            intermediario: [''],
            fechaReserva: [''],
            fechaEntrada: [''],
            fechaSalida: [''],
            posVehiculo: [''],
            posFinalVehiculo: [''],
            observaciones: [''],
        });
        this.searchForm = this.formBuilder.group({
          _id: [''],
          clientCode: [''],
        });
  }



  ngAfterViewInit(){

    var date = new Date();
    var fecha = this.formatDate(date);
    this.login.patchValue({fechaSalida : fecha});
    this.login.patchValue({fechaReserva : fecha});


    console.log(fecha);
    this.login.patchValue({clientCode : CacheDataService.getClientId()});


  }

  addAlert(message){
    this.activate = true;
    this.message = message;
  }

  keytab(pos, extra = 0){
    if(pos == -1){
      var lastElement : any = this.questions.last;
      lastElement.nativeElement.focus();
    }else{
      var elements : Array<any> = this.questions.toArray();
      elements[pos + extra].nativeElement.focus();
    }
  }

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
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

  get f() { return this.login.controls; }
  get t() { return this.f.inputs as FormArray; }

  onClickAdd(){
    this.t.push(this.formBuilder.group({
                    name: ['', Validators.required],
                }));
  }

  showSearch(){
    if(!this.search || this.guindol.closed){
      this.search = true;
      this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');
      //this.guindol = window.open('http://localhost:4200/#/listaContrato');
      var info = {tabla : this.listaPor};
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
    }/*else
      this.onClickSearch();*/
  }


  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "reservas";
    //this.search = false;

    this.guindol.postMessage(info, "*");
  }

  select(index){
    this.delete = true;
    this.readyToPrint = true;
    this.login.patchValue(this.db[index]);
    CacheDataService.setClientId(this.db[index]._id);
  }

  cambio(value){
    this.tipoPago = value;
  }

  calculatePrice(){
    var dias = (1000*60*60*24);
    var entrada = new Date(this.login.value.fechaEntrada).getTime();
    var salida = new Date(this.login.value.fechaSalida).getTime();
    var aCobrar = Math.round(Math.abs(salida - entrada)/dias)*28;
    this.login.patchValue({precio : aCobrar});
  }

  updateTerms(){
    this.login.patchValue({
      _id : "",
      grupo : "",
      precio : "",
      matricula : "",
      fechaEntrada : this.login.value.fechaSalida,
      fechaSalida : "",
      gasolina : ""
    });
  }

  deleteElement(){
    if(!confirm("Confirma eliminarlo"))
      return;
    this.delete = false;
    this.readyToPrint = false;
    var info = { tabla : "reservas",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.addAlert(res);
    });
  }

  onClickSubmit(){
    if(!confirm("Se va a guardar la información"))
      return;
    //this.printData();
    var formData = this.login.value;
    formData.tabla = "reservas";
    formData.fechaEntrada = new Date(formData.fechaEntrada).getTime();
    formData.fechaSalida = new Date(formData.fechaSalida).getTime();

    if(!("_id" in formData) || formData._id == '' || formData._id == undefined){
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
        this.readyToPrint = true;
        /*this.data.updateState({matricula : this.login.value.matricula, fechaSalida : formData.fechaSalida,
                              fechaEntrada : formData.fechaEntrada, grupo: this.login.value.grupo, status: 1}).subscribe(res=>{
          console.log(res);
        });*/
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
      });
    }
  }


  printData(){
    // epson LQ 500 ESC/P 2 Ver 2.0
    this.printer.requestUsb();
    this.printer.print();
  }

  cambioSearch(value){
    this.listaPor = value;
    var info = {tabla : value};
    this.guindol.postMessage(info, "*");

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
    //this.nuevo = false;
  }

  console.log(event);


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}


}
