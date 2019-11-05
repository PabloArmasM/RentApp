import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { ThermalPrinterService } from '../thermal-printer.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-prolongar',
  templateUrl: './prolongar.component.html',
  styleUrls: ['./prolongar.component.scss']
})


export class ProlongarComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;


  login: FormGroup;
  searchForm : FormGroup;
  submitted = false;
  tipoPago = "efectivo";

  file = "";
  search = false;
  recibe = false;
  updateCar = false;
  delete = false;
  readyToPrint = false;
  guindol : any;

  db: any[] = [];

  nuevo = false;

  secondsCounter = interval(1000);

  counterSub : any;


  constructor(private formBuilder: FormBuilder, private cache : CacheDataService, private data: DatProviderService, private printer: ThermalPrinterService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }


  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            clientCode: [''],
            grupo: [''],
            numHotel: [''],
            bono: [''],
            precio: [''],
            numFactura: [''],
            operador: [''],
            intermediario: [''],
            matricula: [''],
            lugar: [''],
            fechaEntrada: [''],
            fechaSalida: [''],
            posVehiculo: [''],
            posFinalVehiculo: [''],
            telefono: [''],
            gasolina: [''],
            conexion : [''],
            inputs: new FormArray([])
        });
        this.searchForm = this.formBuilder.group({
          _id: [''],
          clientCode: [''],
          numFactura: [''],
          telefono: ['']
        });

        //this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');

        this.guindol = window.open('http://localhost:4200/#/listaContrato');
        this.guindol.postMessage("hello baby", "*");

        // Create an Observable that will publish a value on an interval
        // Subscribe to begin publishing values
        this.counterSub = this.secondsCounter.subscribe(n =>{
          this.guindol.postMessage(0, '*');
          console.log("Mensaje enviado");
          if(n>100){
            console.log(n);
            this.counterSub.unsubscribe();
          }
        });
        //this.guindol = window.open('file://'+__dirname+'/index.html#/listas');
  }


  caca(){
    this.guindol.postMessage("Fuerte loco", '*');
  }

  ngAfterViewInit(){

    var date = new Date();
    var fecha = this.formatDate(date);
    this.login.patchValue({fechaEntrada : fecha});

    console.log(fecha);
    this.login.patchValue({clientCode : CacheDataService.getClientId()});


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
    if(!this.search)
      this.search = true;
    else
      this.onClickSearch();
  }

  prepareData(data){
    this.delete = true;
    this.readyToPrint = true;
    this.updateCar = true;
    var info = data;
    info.fechaSalida = this.formatDate(new Date(info.fechaSalida));
    info.fechaEntrada = this.formatDate(new Date(info.fechaEntrada));

    this.login.patchValue(info);

    var inputs = info.inputs;
    info.inputs.forEach(elementos => {
      this.t.push(this.formBuilder.group({
                      name: [elementos, Validators.required],
                  }));
    });
  }

  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "contratos";
    this.closeSearch();

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
    this.delete = false;
    this.readyToPrint = false;
    var info = { tabla : "contratos",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }

  onClickSubmit(){
    //this.printData();
    var formData = this.login.value;
    formData.tabla = "contratos";
    formData.fechaEntrada = new Date(formData.fechaEntrada).getTime();
    formData.fechaSalida = new Date(formData.fechaSalida).getTime();

    if(!("_id" in formData) || formData._id == '' || formData._id == undefined && this.delete){
      console.log("Se supone que esta vacio");
      var inputs = this.login.value.inputs;
      delete formData.inputs;
      var element: any[] = [];
      for(var i = 0; i < inputs.length; i++){
        element.push(inputs[i].name);
      }
      formData.inputs = element;
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
        this.readyToPrint = true;
        this.data.updateState({matricula : this.login.value.matricula, fechaSalida : formData.fechaSalida,
                              fechaEntrada : formData.fechaEntrada, grupo: this.login.value.grupo, status: 1}).subscribe(res=>{
          console.log(res);
        });
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }


  printData(){
    // epson LQ 500 ESC/P 2 Ver 2.0
    this.printer.requestUsb();
    this.printer.print();
  }

  ngOnDestroy() {
    try{
      this.guindol.close();
      this.counterSub.unsubscribe();
    }catch(err){
      console.log("Ya se ha cerrado");
    }
  }


  next(){
    if(this.delete){
      var contrato = this.login.value;
      this.nuevo = true;
      this.login.reset();
      this.login.patchValue({
        clientCode: contrato['clientCode'],
        grupo: contrato['grupo'],
        numHotel: contrato['numHotel'],
        bono: contrato['bono'],
        operador: contrato['operador'],
        intermediario: contrato['intermediario'],
        matricula: contrato['matricula'],
        fechaSalida: contrato['fechaEntrada'],
        telefono: contrato['telefono'],
        conexion : contrato['numFactura'],
        inputs: contrato['inputs']
      });
    }
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
