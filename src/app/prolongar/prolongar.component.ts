import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prolongar',
  templateUrl: './prolongar.component.html',
  styleUrls: ['./prolongar.component.scss']
})
export class ProlongarComponent implements OnInit {

  guindol : any;

  constructor() { }

  ngOnInit() {
    //this.guindol = window.open('file://'+__dirname+'/index.html#/listas');
    this.gindol = window.open('http://localhost:4200/#/listas');
  }

  ngOnDestroy() {
    this.guindol.close();
  }

}
