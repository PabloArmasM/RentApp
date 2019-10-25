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

  head : any[] = [];
  ready = false;

  mainSource : any;
  originSource : any;

  constructor(private dat : DatProviderService, private cache : CacheDataService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);

  }

  setTable(print, header){
    this.print = new MatTableDataSource(print);
    this.head = header;
    this.ready = true;
  }

  caca(i){
    console.log(this.print.data[i]);
    this.mainSource.postMessage(this.print.data[i], this.originSource);
  }

  ngOnInit() {
    var time = new Date();
    var day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    var toSearch = {tabla : "contratos"};
    this.dat.getData(JSON.stringify(toSearch)).subscribe(res => {
      debugger;
      this.setTable(res, Object.keys(res[0]));
      this.ready = true;
    });
  }

  receiveMessage(event)
{
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  debugger;
  /*if (event.origin !== "http://localhost:4200")
    return;*/

  console.log(event.data);
  this.mainSource = event.source;
  this.originSource = event.origin;
  console.log("que paso mi hermano?");
  console.log(event.source);
  console.log(event.origin);


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

}
