import { Input, Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { MovingService } from '../moving.service';
import { FormatingService } from '../formating.service';




@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;



  login: FormGroup;
  searchForm : FormGroup;

  index = 0;
  indexSearch = 0;
  file = "";
  search = false;
  recibe = false;
  delete = false;
  activate = false;


  counterSub : any;



  guindol : any;

  secondsCounter = interval(1000);
  takeFourNumbers = this.secondsCounter.pipe(take(100));



  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService, private mess : MessageService,
  private move : MovingService, private format: FormatingService) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  ngOnInit() {
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
            fechaExp: ['']
        });
      this.searchForm = this.formBuilder.group({
        _id: [''],
        license: [''],
        nombre: [''],
        apellidos: [''],
        email: [''],
        dni: [''],
        telefono: ['']
      });
  }




  deleteElement(){
    if(!confirm("¿Está seguro de que desea eliminarlo?"))
      return;
    this.delete = false;
    var info = { tabla : "clientes",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.mess.addAlert(res);
    });
  }


  onClickSubmit(){
    if(!confirm("Se va a guardar la información"))
      return;
    var formData = this.login.value;
    formData.tabla = "clientes";
    formData.fecha = new Date(formData.fecha).getTime();
    formData.fechaExp = new Date(formData.fechaExp).getTime();
    this.data.submit(formData, this.mess);
    this.login.reset();
  }

  showSearch(){
    if(!this.search || this.guindol.closed){
      this.search = true;
      //this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');
      this.guindol = window.open('http://localhost:4200/#/listaContrato');
      var info = {tabla : 'clientes'};
      this.guindol.postMessage(info, "*");

      this.counterSub = this.takeFourNumbers.subscribe(n =>{
        this.guindol.postMessage(n, '*');
        console.log("Mensaje enviado");
        if(n < 1){
          this.guindol.postMessage(info, "*");
        }
        if(n>100){
          console.log(n);
          this.counterSub.unsubscribe();
        }
      });
    }
  }



  ngOnDestroy() {
    try{
      this.guindol.close();
      this.counterSub.unsubscribe();
    }catch(err){
      console.log("Ya se ha cerrado");
    }
  }

  prepareData(data){
    this.delete = true;
    var info = data;
    info.fecha = this.format.formatDate(new Date(info.fecha));
    info.fechaExp = this.format.formatDate(new Date(info.fechaExp));

    debugger;
    this.login.patchValue(info);
  }

  receiveMessage(event)
  {
  if(event.data.hasOwnProperty('_id')){
    this.counterSub.unsubscribe();
    this.prepareData(event.data);
  }

  console.log(event);
  }

}
