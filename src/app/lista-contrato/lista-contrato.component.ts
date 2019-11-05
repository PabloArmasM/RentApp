import { Component, OnInit } from '@angular/core';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import {MatTableDataSource} from '@angular/material/table';



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
    }

  };

  head = {};
  displayColumns = [];
  ready = false;

  mainSource : any;
  originSource : any;

  constructor(private dat : DatProviderService, private cache : CacheDataService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);

  }

  setTable(print){
    debugger;
    this.print = new MatTableDataSource(print);
    //this.head = header;
    this.ready = true;
  }

  caca(i){
    debugger;
    console.log(this.print.data[i]);
    this.mainSource.postMessage(this.print.data[i], this.originSource);
  }

  ngOnInit() {
    var time = new Date();
    var day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    var toSearch = {tabla : "contratos"};
    this.chargeData(toSearch);

  }

  chargeData(data){
    //this.displayColumns = Object.keys(this.head);
    this.print = new MatTableDataSource();
    this.displayColumns = Object.keys(this.allHeads[data.tabla]);
    this.head = this.allHeads[data.tabla];
    this.dat.getData(JSON.stringify(data)).subscribe(res => {
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
