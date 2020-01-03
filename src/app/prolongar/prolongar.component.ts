import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { ThermalPrinterService } from '../thermal-printer.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';




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
  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};

  db: any[] = [];

  nuevo = false;

  secondsCounter = interval(1000);
  takeFourNumbers = this.secondsCounter.pipe(take(100));
  counterSub : any;

  allPrices : any;

  datoVehiculo : any;
  datosClientes: any;

  diasPrint: number;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private cache : CacheDataService, private data: DatProviderService, private printer: ThermalPrinterService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }


  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            clientCode: ['', Validators.required],
            grupo: ['', Validators.required],
            numHotel: [''],
            precio: [''],
            operador: ['', Validators.required],
            intermediario: [''],
            matricula: ['', Validators.required],
            lugar: ['', Validators.required],
            fechaEntrada: ['', Validators.required],
            fechaSalida: [''],
            posVehiculo: ['', Validators.required],
            posFinalVehiculo: ['', Validators.required],
            telefono: [''],
            gasolina: [''],
            igic: ['', Validators.required],
            tarifa: ['', Validators.required],
            seguroCoche: ['', Validators.required],
            seguroPersonal: ['',Validators.required],
            conexion : [''],
            inputs: new FormArray([])
        });
        this.searchForm = this.formBuilder.group({
          _id: [''],
          clientCode: [''],
          numFactura: [''],
          telefono: ['']
        });

        this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');

        //this.guindol = window.open('http://localhost:4200/#/listaContrato');
        this.guindol.postMessage("hello baby", "*");

        // Create an Observable that will publish a value on an interval
        // Subscribe to begin publishing values
        this.counterSub = this.takeFourNumbers.subscribe(n =>{
          this.guindol.postMessage(0, '*');
          console.log("Mensaje enviado");
          if(n>100){
            console.log(n);
            this.counterSub.unsubscribe();
          }
        });
        //this.guindol = window.open('file://'+__dirname+'/index.html#/listas');
  }

  searchDocument(){
    var document = this.login.value.conexion;
    var data = {tabla : "contratos", _id: document};
    debugger;
    this.data.getData(data).subscribe(rest =>{
      debugger;
      var res = rest[0];
      if( res == undefined || res == '' ){
        confirm("No existe ningún contrato con ese codigo");
      }else
        this.login.patchValue({
          clientCode : res.clientCode,
          grupo : res.grupo,
          fechaSalida: this.formatDate(res.fechaSalida),
          intermediario: res.intermediario,
          matricula: res.matricula,
          dirLocal: res.dirLocal,
          telefono : res.telefono,
          gasolina : res.gasolina,
          posVehiculo: res.posVehiculo,
          posFinalVehiculo: res.posFinalVehiculo
        });
    });
  }

  searchMatricula(){
    var matricula = this.login.value.matricula;
    var data = {tabla : "vehiculos", matricula: matricula};

    this.data.getData(data).subscribe(rest =>{

      var res = rest[0];
      if(res == '' || res == undefined){
        confirm("No existe ningún vehículo para esta matrícula");
      }else{
        this.datoVehiculo = res;
        this.login.patchValue({gasolina : res.gasolina});
      }
    });
  }

  searchClient(){
    var matricula = this.login.value.clientCode;
    var data = {tabla : "clientes", _id: matricula};

    this.data.getData(data).subscribe(rest =>{

      var res = rest[0];
      if( res == undefined || res == '' ){
        confirm("No existe ningún cliente con ese ID");
      }else
        this.datosClientes = res;
    });
  }

  addAlert(message){
    this.activate = true;
    this.message = message;
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
    this.data.getData({tabla : 'tarifas'}).subscribe(res => {
      console.log(res);
      this.allPrices = res[0];
      this.login.patchValue(
        {seguroCoche: res[0].seguroCoche,
          seguroPersonal : res[0].seguroPersonal,
        igic : res[0].igic}
      );
    });


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

  setTarifaGrupo(){
    var group = this.login.value["grupo"].toUpperCase();
    if(this.allPrices.hasOwnProperty(group))
      this.login.patchValue({tarifa : this.allPrices[group]})
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
    else if(this.guindol.closed){
      this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');
    }
    /*else
      this.onClickSearch();*/
  }

  prepareData(data){
    this.delete = true;
    this.readyToPrint = true;
    this.updateCar = true;
    var info = data;
    info.fechaSalida = this.formatDate(new Date(info.fechaSalida));
    info.fechaEntrada = this.formatDate(new Date(info.fechaEntrada));

    this.login.patchValue(info);
    this.searchMatricula();
    this.searchClient();
    var inputs = info.inputs;
    info.inputs.forEach(elementos => {
      this.t.push(this.formBuilder.group({
                      name: [elementos, Validators.required],
                  }));
    });
  }

  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "prolongar";
    //this.closeSearch();

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
    var info = { tabla : "contratos",
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
      this.data.addData(formData).subscribe(res =>{
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
        this.readyToPrint = true;
        this.data.updateState({matricula : this.login.value.matricula, fechaSalida : formData.fechaSalida,
                              fechaEntrada : formData.fechaEntrada, grupo: this.login.value.grupo, status: 1}).subscribe(res=>{
          console.log(res);
        });
      });
    }else{
      console.log(formData);
      this.data.updateData(formData).subscribe(res =>{
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
      });
    }
  }


  firstPart(date){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);



    return (day + "-" + month + "-" + year);
  }


  secondPart(date){
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);



    return (hours+":"+minutes);
  }


  calculateOnlyDays(){
    var dias = (1000*60*60*24);
    var entrada = new Date(this.login.value.fechaSalida).getTime();
    var salida = new Date(this.login.value.fechaEntrada).getTime();
    dias = Math.round(Math.abs(salida - entrada)/dias)
    if(dias == 0){
      dias = 1;
    }

    this.diasPrint = dias;
  }

  getSubtotal(){
    var dias = (1000*60*60*24);
    var entrada = new Date(this.login.value.fechaSalida).getTime();
    var salida = new Date(this.login.value.fechaEntrada).getTime();
    dias = Math.round(Math.abs(salida - entrada)/dias)
    if(dias == 0){
      dias = 1;
    }

    this.diasPrint = dias;

    var aCobrar = dias*this.login.value.tarifa;
    //aCobrar = aCobrar + (aCobrar * (this.login.value.igic/100));
    aCobrar = aCobrar + (dias * this.login.value.seguroCoche) + (dias * this.login.value.seguroPersonal);
    return aCobrar;
  }

  getImpuesto(){
    var dias = (1000*60*60*24);
    var entrada = new Date(this.login.value.fechaSalida).getTime();
    var salida = new Date(this.login.value.fechaEntrada).getTime();
    dias = Math.round(Math.abs(salida - entrada)/dias)
    if(dias == 0){
      dias = 1;
    }

    this.diasPrint = dias;

    var aCobrar = dias*this.login.value.tarifa;
    aCobrar = (aCobrar * (this.login.value.igic/100));
    return aCobrar;
  }

  preapreInput(data){
    var result = [];
    data.forEach(element =>{
      result.push(element.name + " - "+ element.license);
    });
    return result;
  }

  printData(){
    // epson LQ 590 ESC/P 2 Ver 2.0
    //this.printer.requestUsb();
    //this.printer.print();
    var precio = this.diasPrint * this.login.value.tarifa;

    var data = {
      numFactura : this.login.value._id,
      modelo : this.datoVehiculo.modelo,
      matricula : this.datoVehiculo.matricula,
      color : this.datoVehiculo.color,
      bastidor: this.datoVehiculo.bastidor,
      propietario: this.datoVehiculo.propietario,
      devolver: this.login.value.posFinalVehiculo,
      salida: this.login.value.posVehiculo,
      fecha: this.firstPart(new Date(this.login.value.fechaSalida)),
      hora: this.secondPart(new Date(this.login.value.fechaSalida)),
      gas: this.login.value.gasolina,
      fechaDev: this.firstPart(new Date(this.login.value.fechaEntrada)),
      horaDev: this.secondPart(new Date(this.login.value.fechaEntrada)),
      grupo: this.datoVehiculo.grupo,
      dirPerm: this.datosClientes.direccion,
      dias: this.diasPrint,
      tarifa: this.login.value.tarifa,
      precio: precio,
      dirLocal: this.login.value.lugar,
      nacionalidad: this.datosClientes.nacionalidad,
      subtotales: precio,
      menos: "?",
      permiso: this.datosClientes.license,
      clase: "B",
      fechaExp: this.firstPart(this.datosClientes.fechaExp),
      danos : this.login.value.seguroCoche,
      personal: this.login.value.seguroPersonal,
      fechaNa: this.firstPart(this.datosClientes.fecha),
      conductores: this.preapreInput(this.login.value.inputs),
      subtotal: this.getSubtotal(),
      impuesto: this.getImpuesto(),
      total: this.login.value.precio,
      estado: this.login.value.estado,
      observaciones: this.login.value.observaciones,
      pago: this.tipoPago,
      operador: this.login.value.operador,
      nombre: this.datosClientes.nombre,
      conexion: this.login.value.conexion

    };
    debugger;

    this.data.printContrato(data).subscribe(res =>{
      console.log(res);
    });
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

  cerrar(): void {
    var aux = this.login.value.matricula;
    const dialogRef = this.dialog.open(CierreProlongar, {
      width: '900px',
      height: '500px',
      data: {matricula : aux}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }


  receiveMessage(event)
{
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  /*if (event.origin !== "http://localhost:4200")
    return;*/

    if(event.data.hasOwnProperty('_id')){
      this.counterSub.unsubscribe();
      if(!event.data.hasOwnProperty('clientCode')){
        this.login.patchValue({
          clientCode : event.data["_id"]
        });
      }else{
        this.prepareData(event.data);
      }
    }
  console.log(event);


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

}



@Component({
  selector: 'cierre-prolongar',
  templateUrl: 'cierre-prolongar.html',
  styleUrls: ['./prolongar.component.scss']
})
export class CierreProlongar {

  res:any;
  login: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<CierreProlongar>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private dat: DatProviderService) {
    }

    ngOnInit() {
      this.login = this.formBuilder.group({
            lugar:[''],
            fecha:[''],
            gasolina:[''],
            operador:['']
          });
    }


    searchSucursal(){
      var sucursal = this.login.value.lugar.toUpperCase();

      this.dat.searchSp({tabla : "sucursal", _id: sucursal}).subscribe(res =>{
        var rest = res[0].name.toUpperCase();
        this.login.patchValue({
          lugar : rest
        });
      });
    }

    searchOperador(){

      this.dat.searchSp({tabla : "operadores", _id: this.login.value.operador}).subscribe(res =>{
        var rest = res[0].name.toUpperCase();
        this.login.patchValue({ operador : rest});
      });
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

    ngAfterViewInit(){
      var date = new Date();
      var fecha = this.formatDate(date);
      this.login.patchValue({fecha : fecha});
    }

    firstPart(date){
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);



      return (day + "-" + month + "-" + year);
    }


    secondPart(date){
      var hours = ("0" + date.getHours()).slice(-2);
      var minutes = ("0" + date.getMinutes()).slice(-2);
      var seconds = ("0" + date.getSeconds()).slice(-2);



      return (hours+":"+minutes);
    }


    submit(){
        var data = {tabla : "vehiculos", matricula: this.data.matricula};
        this.dat.getData(data).subscribe(res => {
          var aux = res[0];
          this.dat.updateData({tabla:"vehiculos", _id:aux._id, gasolina:aux.gasolina, situacion:1}).subscribe(res =>{
            console.log("ready");
          });
        });
        if(confirm("¿Desea imprimir el cierre?")){
          this.printData(this.login.value.lugar, this.firstPart(new Date(this.login.value.fecha)), this.secondPart(new Date(this.login.value.fecha)), this.login.value.gasolina);
        }
    }

    printData(entrada, fecha, hora, gas){
      // epson LQ 590 ESC/P 2 Ver 2.0
      //this.printer.requestUsb();
      //this.printer.print();

      var data = {
        entrada: entrada,
        fecha: fecha,
        hora: hora,
        gas: gas
      };


      this.dat.printCierre(data).subscribe(res =>{
        console.log(res);
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
