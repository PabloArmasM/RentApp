import { Component, OnInit, ViewChild} from '@angular/core';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  search : String;
  print = new MatTableDataSource();

  head : any[] = [];
  ready = false;

  colNames = ["_id", "license", "nombre", "apellidos", "direccion", "email", "dni", "nacionalidad", "fecha", "telefono", "sucursal", "operador"];


  constructor(private dat : DatProviderService) { }


  ngOnInit() {
    this.print.sort = this.sort;
    this.activate("clientes");
  }

  setTable(print, header, search){
    this.print = new MatTableDataSource(print);
    this.head = header;
    this.ready = true;
    this.search = search;
    debugger;
  }

  activate(search){
    this.head = [];
    this.print = new MatTableDataSource();
    var toSearch = {};
    if(search === "contratos" || search === "reservas"){
      var time = new Date();
      var day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      toSearch = {tabla : search, fechaEntrada : day.getTime()};
      this.dat.getData(JSON.stringify(toSearch)).subscribe(res => {
        this.setTable(res, Object.keys(res[0]), search);
      })
    }else{
      toSearch = {tabla : search};
      this.dat.getData(JSON.stringify(toSearch)).subscribe(res =>{
        this.setTable(res, Object.keys(res[0]), search);
        debugger;
      });
    }

  }



  applyFilter(filterValue: string) {
      this.print.filter = filterValue.trim().toLowerCase();
    }
}
