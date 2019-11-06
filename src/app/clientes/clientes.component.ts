import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';

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
  db: any[] = [];

  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) { }

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

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
  }

  showSearch(){
    if(!this.search)
      this.search = true;
    else
      this.onClickSearch();
  }

  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "clientes";
    //this.closeSearch();

    this.guindol.postMessage(info, "*");
  }

  deleteElement(){
    this.delete = false;
    var info = { tabla : "clientes",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }


  select(index){
    this.delete = true;
    this.login.patchValue(this.db[index]);
    CacheDataService.setClientId(this.db[index]._id);
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.tabla = "clientes";
    formData.fecha = new Date(formData.fecha).getTime();
    console.log(formData.fecha);
    if(!("_id" in formData) || formData._id == '' || formData._id == undefined){
      console.log("Se supone que esta vacio");
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        //console.log(res._id);
        CacheDataService.setClientId(res._id);
        this.login.patchValue(res);
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        CacheDataService.setClientId(res._id);
        this.login.patchValue(res);
      });
    }
  }
}
