import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';



@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;


  search = false;
  recibe = false;
  delete = false;

  file = "";
  db: any[] = [];

  tipoPago = "manual";

  login: FormGroup;
  searchForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) { }

  ngOnInit() {
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
            gasolina: ['']
        });
      this.searchForm = this.formBuilder.group({
          _id: [''],
          matricula: [''],
          grupo : [''],
          modelo: [''],
      });
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
    info.tabla = "vehiculos";
    this.search = false;

    this.data.getData(JSON.stringify(info)).subscribe(res => {
      if(res.length > 1){
        this.recibe = true;
        console.log(res);
        res.forEach(son =>{
          this.db.push(son);
        });
        //this.db = JSON.parse(res);
      }else if(res.length == 1){
        //this.updateCar = true;
        this.delete = true;
        var info = res[0];
        var date = new Date(res[0].fecha);
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        res[0].fecha = year + "-" + month + "-" + day;
        this.login.patchValue(info);
        /*Object.keys(res[0]).forEach(keys => {
          if(log.hasOwnProperty(keys)){
            debugger;
            this.login.patchValue({codigo: "aaaaaa"});
          }
        });*/
      }
    });


  }

  deleteElement(){
    this.delete = false;
    var info = { tabla : "vehiculos",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }


  cambio(value){
    this.tipoPago = value;
  }


  select(index){
    this.delete = true;
    this.login.patchValue(this.db[index]);
  }

  showSearch(){
    if(!this.search)
      this.search = true;
    else
      this.onClickSearch();
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.tabla = "vehiculos";
    formData.tipo = this.tipoPago;
    formData.fecha = new Date(formData.fecha).getTime();
    if(!("_id" in formData) || formData._id == '' || formData._id == undefined || formData._id == -1){
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.data.addVehiculeRutine(JSON.stringify({grupo: this.login.value.grupo, matricula : this.login.value.matricula, fecha: this.login.value.fecha})).subscribe(res =>{});
        this.login.patchValue(res);
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }

}
