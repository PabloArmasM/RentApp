import { Component, OnInit } from '@angular/core';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-lista-contrato',
  templateUrl: './lista-contrato.component.html',
  styleUrls: ['./lista-contrato.component.scss']
})
export class ListaContratoComponent implements OnInit {


  print = new MatTableDataSource();

  allHeads = {
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
  ready = false;
  search = "contratos";

  mainSource : any;
  originSource : any;
  login: FormGroup;

  prolongar = true;
  selectedTable = "contratos";

  constructor(private formBuilder: FormBuilder, private dat : DatProviderService, private cache : CacheDataService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
    this.login = this.formBuilder.group({
            _id: [''],
            license: [''],
            nombre: [''],
            apellidos: [''],
            direccion: [''],
            email: [''],
            dni: [''],
            nacionalidad: [''],
            telefono: [''],
            sucursal: [''],
            operador: [''],
            bisni : [''],
            comision : [''],
            observaciones : [''],
            operacionesAnuales : [''],
            clientCode : [''],
            grupo : [''],
            fecha: [''],
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

  setTable(print){
    debugger;
    this.print = new MatTableDataSource(print);
    //this.head = header;
    this.ready = true;
  }

  changeTable(table){
    debugger;
    this.selectedTable = table;
    var toSearch = {tabla : "prolongar"};
    this.chargeData(toSearch);
  }

  caca(i){
    debugger;
    console.log(this.print.data[i]);
    this.mainSource.postMessage(this.print.data[i], this.originSource);
  }

  ngOnInit() {
    var time = new Date();
    var day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    var toSearch = {tabla : "prolongar"};
    this.chargeData(toSearch);

  }

  chargeData(data){
    //this.displayColumns = Object.keys(this.head);
    if(data.tabla == "prolongar"){
      data.tabla = this.selectedTable;
    }else{
      this.prolongar = false;
    }
    this.print = new MatTableDataSource();
    this.displayColumns = Object.keys(this.allHeads[data.tabla]);
    this.search = data.tabla;
    this.head = this.allHeads[data.tabla];
    this.dat.getData(data).subscribe(res => {
      console.log(res);
      if(this.search == "vehiculos"){
        debugger;
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


  searchData(){
    var data = this.cache.clean(this.login.value);
    data.tabla = this.search;

    if(data.hasOwnProperty('fecha'))
      data['fecha'] = new Date(data['fecha']).getTime();
    if(data.hasOwnProperty('fechaReserva'))
      data['fecha'] = new Date(data['fechaReserva']).getTime();
    if(data.hasOwnProperty('fechaEntrada'))
      data['fecha'] = new Date(data['fechaEntrada']).getTime();
    if(data.hasOwnProperty('fechaSalida'))
      data['fecha'] = new Date(data['fechaSalida']).getTime();


    this.print = new MatTableDataSource();
    this.displayColumns = Object.keys(this.allHeads[this.search]);
    this.head = this.allHeads[this.search];
    this.dat.getData(data).subscribe(res => {
      console.log(res);
      this.setTable(res);
      this.ready = true;
    });
  }

  receiveMessage(event)
{
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  /*if (event.origin !== "http://localhost:4200")
    return;*/
    if(event.data.hasOwnProperty('tabla'))
      this.chargeData(event.data);


  console.log(event.data);
  this.mainSource = event.source;
  this.originSource = event.origin;


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

applyFilter(filterValue: string) {
    this.print.filter = filterValue.trim().toLowerCase();
  }

}
