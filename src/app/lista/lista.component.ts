import { Component, OnInit, ViewChild} from '@angular/core';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  search : String;
  print = new MatTableDataSource();

  ready = false;

  allHeads: any = {
    contratos : {
      _id:'Código', clientCode:'Código del cliente',	/*grupo,	numHotel,	bono,	precio,*/	numFactura:'Número de la factura',	/*operador,	intermediario,*/	matricula: 'Matrícula',	/*lugar,	*/	fechaSalida : "Fecha de salida", fechaEntrada:"Fecha de entrada",	/*posVehiculo,	posFinalVehiculo,*/	telefono : "Teléfono",	/*gasolina,	inputs*/
    },
    clientes :
    {
      _id: 'Código',
      license: 'Licencia',
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      /*direccion*/
      email : 'Correo',
      /*dni
      nacionalidad*/
      fecha : 'Fecha de nacimiento',
      telefono : 'Teléfono',
      /*sucursal
      operador*/
    },
    intermediarios : {
      _id : 'Codigo',
      name : 'Nombre',
      direccion : 'Dirección',
      bisni : 'Empresa',
      comision : 'Comisión',
      telefono : 'Teléfono',
      observaciones : 'Observaciones',
      operacionesAnuales : 'Operaciones anuales'
    },
    vehiculos :{
      _id : 'Código',
      matricula : 'Matrícula',
      grupo : 'Grupo',
      modelo : 'Modelo',
      color : 'Color',
      bastidor : 'Bastidor',
      propietario : 'Propietario',
      situacion : 'Situación',
      fecha : 'Fecha',
      gasolina : 'Estado tanque',
      tipo : 'Caja de cambio'
    },
    reservas : {
      _id: 'Código',
      clientCode: 'Código del cliente',
      grupo: 'Grupo del vehículo',
      /*operador: '',
      sucursal: '',
      intermediario: '',*/
      fechaReserva: 'Fecha de la reserva',
      fechaEntrada: 'Fecha entrada',
      fechaSalida: 'Fecha salida',
      posVehiculo: 'Lugar de entrega',
      //posFinalVehiculo: '',
      //observaciones: '',
    },
    operadores : {
      _id : "ID",
      name : "Nombre"
    }

  };

  head = {};
  displayColumns = [];
  login: FormGroup;



  constructor(private formBuilder: FormBuilder, private dat : DatProviderService,  private cache: CacheDataService) {
    this.login = this.formBuilder.group({
            _id: [''],
            license: [''],
            nombre: [''],
            apellidos: [''],
            direccion: [''],
            email: [''],
            dni: [''],
            nacionalidad: [''],
            fecha: [''],
            telefono: [''],
            sucursal: [''],
            operador: [''],
            bisni : [''],
            comision : [''],
            observaciones : [''],
            operacionesAnuales : [''],
            clientCode : [''],
            grupo : [''],
            fechaReserva: [''],
            fechaEntrada: [''],
            fechaSalida: [''],
            posVehiculo: [''],
            matricula : [''],
            modelo : [''],
            color : [''],
            bastidor : [''],
            propietario : [''],
            situacion : [''],
            gasolina : [''],
            tipo : ['']
        });
  }


  ngOnInit() {
    this.print.sort = this.sort;
    //this.activate("clientes");
  }

  formatDate(date, hour, min){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);

    return new Date(year + "-" + month + "-" + day +"T"+hour+":"+min);
  }

  formatForPrint(date){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return (year + "-" + month + "-" + day +"T"+hours+":"+minutes);
  }

  setTable(print){

    this.print = new MatTableDataSource(print);
    //this.head = header;
    this.ready = true;
  }

  chargeData(data){
    //this.displayColumns = Object.keys(this.head);
    this.print = new MatTableDataSource();
    this.displayColumns = Object.keys(this.allHeads[data.tabla]);
    this.head = this.allHeads[data.tabla];

    this.dat.getData(data).subscribe(res => {
      console.log(res);

      if(this.search == "vehiculos"){

        res.forEach(element =>{
          if(element.situacion == 1){
            element.situacion = "Activo";
          }else if(element.situacion == -1){
            element.situacion = "Reparándose";
          }else if(element.situacion == -2){
            element.situacion = "En venta";
          }
        });
      }
      this.setTable(res);
      this.ready = true;
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

 toPrint(){
   var limit = 120;
   //Fecha entrada, fecha salida, fecha reserva, grupo, Lugar, A devolver, Observaciones
   //17 ~ 15
   var print = [];
   var phrase = "|";
   var quei = Object.keys(this.print.data);

    phrase = this.putWord(phrase, "Fecha salida", 19); //Palabra, hueco, pos
    phrase = this.putWord(phrase, "Fecha Entrada", 19);
    phrase = this.putWord(phrase, "Fecha Reserva", 19);
    phrase = this.putWord(phrase, "Grupo", 6);
    phrase = this.putWord(phrase, "Lugar", 16);
    phrase = this.putWord(phrase, "A devolver", 16);
    phrase = this.putWord(phrase, "Observaciones", 16);
     console.log(phrase);
     print.push(phrase);

     var aux : any = this.print.data;
     for(var i = 0; i < aux.length; i++){
        phrase = "|";
        phrase = this.putWord(phrase, this.formatForPrint(new Date (aux[i].fechaReserva)), 19); //Palabra, hueco, pos
        phrase = this.putWord(phrase, this.formatForPrint(new Date (aux[i].fechaEntrada)), 19);
        phrase = this.putWord(phrase, this.formatForPrint(new Date(aux[i].fechaReserva)), 19);
        phrase = this.putWord(phrase, aux[i].grupo.substring(aux[i].grupo.length - 1), 6);
        phrase = this.putWord(phrase, aux[i].posVehiculo, 16);
        phrase = this.putWord(phrase, aux[i].posFinalVehiculo, 16);
        phrase = this.putWord(phrase, aux[i].observaciones, 16);
        print.push(phrase);
     }


   this.dat.printReservas({query:print}).subscribe(res =>{
     console.log(res);
   });
 }

  searchData(){

    var data : any = {};
    data = this.cache.clean(this.login.value);
    //data.tabla = this.search;
    this.print = new MatTableDataSource();
    var fechasForQuery = [];

    var day : Date;
    if(data.hasOwnProperty('fecha')){
      day = new Date(data['fecha']);
      fechasForQuery.push({fecha : {$gte: this.formatDate(day, "00", "00").getTime()}});
      fechasForQuery.push({fecha : {$lte: this.formatDate(day, "23", "59").getTime()}});
      delete data['fecha'];
    }
    if(data.hasOwnProperty('fechaReserva')){
      day = new Date(data['fechaReserva']);
      fechasForQuery.push({fechaReserva : {$gte: this.formatDate(day, "00", "00").getTime()}});
      fechasForQuery.push({fechaReserva : {$lte: this.formatDate(day, "23", "59").getTime()}});
      delete data['fechaReserva'];
    }
    if(data.hasOwnProperty('fechaEntrada')){
      day = new Date(data['fechaEntrada']);
      fechasForQuery.push({fechaEntrada : {$gte: this.formatDate(day, "00", "00").getTime()}});
      fechasForQuery.push({fechaEntrada : {$lte: this.formatDate(day, "23", "59").getTime()}});
      delete data['fechaEntrada'];
    }
    if(data.hasOwnProperty('fechaSalida')){
      day = new Date(data['fechaSalida']);
      fechasForQuery.push({fechaSalida : {$gte: this.formatDate(day, "00", "00").getTime()}});
      fechasForQuery.push({fechaSalida : {$lte: this.formatDate(day, "23", "59").getTime()}});
      delete data['fechaSalida'];
    }


    if(data != {} && fechasForQuery.length > 0){
      var alter = {};

      Object.keys(data).forEach(key => {

        alter = {};
        alter[key]= typeof data[key] == "string" ? {$eq: data[key].toUpperCase()} : {$eq: data[key]};
        delete data[key];
        fechasForQuery.push(alter);
      });
      data.query = {$and : fechasForQuery};
    }

    data.tabla = this.search;
    this.head = this.allHeads[data.tabla];
    this.displayColumns = Object.keys(this.head);

    this.login.reset();
    this.dat.getData(data).subscribe(res => {
      console.log(res);
      this.setTable(res);
      this.ready = true;
    });
  }


  activate(search){
    this.search = search;
    this.head = [];
    this.print = new MatTableDataSource();
    var toSearch = {};
    if(search === "contratos" || search === "reservas"){
      var time = new Date();
      var day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      //toSearch = {tabla : search, fechaSalida : day.getTime()};
      //{ $and: [{ fechaEntrada: { $gte : fecha}} , { fechaSalida: {$lte: fecha}}, { matricula: {$eq: matricula}}] }
      toSearch = {tabla: search, query:[{fechaSalida : {$gte: this.formatDate(day, "00", "00").getTime()}}, {fechaSalida : {$lte: this.formatDate(day, "23", "59").getTime()}}]};

      this.chargeData(toSearch);
    }else{
      toSearch = {tabla : search};
      this.chargeData(toSearch);
    }

  }



  applyFilter(filterValue: string) {
      this.print.filter = filterValue.trim().toLowerCase();
    }
}
