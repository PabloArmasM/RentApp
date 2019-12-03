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

  setTable(print){
    debugger;
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
        debugger;
        res.forEach(element =>{
          if(element.situacion != 0){
            element.situacion = "Activo";
          }else
            element.situacion = "Fuera de servicio";
        });
      }
      this.setTable(res);
      this.ready = true;
    });
  }

 toPrint(){
   this.dat.printReservas(this.print.data).subscribe(res =>{
     console.log(res);
   });
 }

  searchData(){
    var data = this.cache.clean(this.login.value);
    data.tabla = this.search;
    this.print = new MatTableDataSource();
    this.displayColumns = Object.keys(this.allHeads[data.tabla]);
    this.head = this.allHeads[data.tabla];
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
      toSearch = {tabla : search, fechaEntrada : day.getTime()};
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
