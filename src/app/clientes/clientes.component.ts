import { Input, Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';




@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;



  login: FormGroup;
  searchForm : FormGroup;

  index = 0;
  indexSearch = 0;
  file = "";
  search = false;
  recibe = false;
  delete = false;
  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};


  counterSub : any;



  guindol : any;

  secondsCounter = interval(1000);
  takeFourNumbers = this.secondsCounter.pipe(take(100));



  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) {
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
            operador: ['']
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

        /*var today = new Date();
        console.log(today.getMonth());
        console.log(today.getFullYear());
        console.log((new Date(today.getFullYear(), today.getMonth(), 1)).getDay());
        console.log((new Date(today.getFullYear(), today.getMonth() + 1,  0)).getDate());*/
  }


  //@ViewChild('license') licenseForm: ElementRef;
  addAlert(message){
    this.activate = true;
    this.message = message;
  }


  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
  }

  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "clientes";
    //this.closeSearch();

    this.guindol.postMessage(info, "*");
  }

  deleteElement(){
    if(!confirm("¿Está seguro de que desea eliminarlo?"))
      return;
    this.delete = false;
    var info = { tabla : "clientes",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.addAlert(res);
    });
  }


  onClickSubmit(){
    if(!confirm("Se va a guardar la información"))
      return;
    var formData = this.login.value;
    formData.tabla = "clientes";
    formData.fecha = new Date(formData.fecha).getTime();
    console.log(formData.fecha);
    if(!("_id" in formData) || formData._id == '' || formData._id == undefined){
      console.log("Se supone que esta vacio");
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        //console.log(res._id);
        CacheDataService.setClientId(res._id);
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        CacheDataService.setClientId(res._id);
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
      });
    }
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

  showSearch(){
    if(!this.search){
      this.search = true;
      this.guindol = window.open('file://'+__dirname+'/index.html#/listaContrato');
      //this.guindol = window.open('http://localhost:4200/#/listaContrato');
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
    }else
      this.onClickSearch();
  }


  closeSearch(){
    this.search = false;
    try{
      this.guindol.close();
      this.counterSub.unsubscribe();
    }catch(err){
      console.log("Ya se ha cerrado");
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
    //this.readyToPrint = true;
    //this.updateCar = true;
    var info = data;
    //info.fechaSalida = this.formatDate(new Date(info.fechaSalida));
    //info.fechaEntrada = this.formatDate(new Date(info.fechaEntrada));
    info.fecha = this.formatDate(new Date(info.fecha));

    this.login.patchValue(info);
  }

  close() {
    this.activate = false;
  }

  receiveMessage(event)
  {
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  /*if (event.origin !== "http://localhost:4200")
    return;*/
  if(event.data.hasOwnProperty('_id')){
    this.counterSub.unsubscribe();
    this.prepareData(event.data);
    //this.nuevo = false;
  }

  console.log(event);


  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
  }

}
