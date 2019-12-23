import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';


export interface DialogData {
  matricula: string;
  situacion: number;
}

@Component({
  selector: 'app-flota',
  templateUrl: './flota.component.html',
  styleUrls: ['./flota.component.scss']
})
export class FlotaComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  search : String;
  print:any;

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



  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private dat : DatProviderService,  private cache: CacheDataService) {
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
          gasolina: [''],
          tipo: ['']
        });
  }


  openDialog(i): void {
    const dialogRef = this.dialog.open(FlotaDialog, {
      width: '250px',
      data: {matricula: this.print.data[i].matricula, situacion: this.print.data[i].situacion}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if(result != undefined){
        console.log(result.situacion);
        this.print.data[i].situacion = result.situacion;
        var formData = {tabla:"vehiculos", _id : this.print.data[i]._id, situacion : result.situacion};
        this.dat.updateData(formData).subscribe(res =>{
          //CacheDataService.setClientId(this.print.data[i]._id);
          //this.login.patchValue({_id : res._id});
          //this.addAlert(res.message);
          console.log(res);
        });
      }
      //this.animal = result;
    });
  }

  ngOnInit() {
    this.print.sort = this.sort;
    //this.activate("clientes");
  }

  ngAfterViewInit(){
    this.activate("vehiculos");
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
      this.setTable(res);
      this.ready = true;
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


@Component({
  selector: 'flota-dialog',
  templateUrl: 'flota-dialog.html',
})
export class FlotaDialog {

  constructor(
    public dialogRef: MatDialogRef<FlotaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

  chanje(value){
    this.data.situacion = value;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
