import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';


@Component({
  selector: 'app-intermediarios',
  templateUrl: './intermediarios.component.html',
  styleUrls: ['./intermediarios.component.scss']
})
export class IntermediariosComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;



  search = false;
  recibe = false;
  file = "";
  db: any[] = [];
  delete = false;

  searchForm : FormGroup;
  login: FormGroup;


  constructor(private formBuilder: FormBuilder, private data: DatProviderService, private cache: CacheDataService) { }

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
  }

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  ngOnInit() {

    this.login = this.formBuilder.group({
            _id: [''],
            name: [''],
            direccion: [''],
            bisni: [''],
            comision: [''],
            telefono: [''],
            observaciones: [''],
            operacionesAnuales: ['']
        });
        this.searchForm = this.formBuilder.group({
          _id: [''],
          name: [''],
          telefono: ['']
        });
  }

  ngAfterViewInit(){
    this.login.patchValue({operacionesAnuales : 0});
  }

  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    this.search = false;
    info.tabla = "intermediarios";

    this.data.getData(JSON.stringify(info)).subscribe(res => {
      if(res.length > 1){
        this.recibe = true;
        console.log(res);
        res.forEach(son =>{
          this.db.push(son);
        });
        //this.db = JSON.parse(res);
      }else if(res.length == 1){
        this.delete = true;
        //this.updateCar = true;
        var info = res[0];

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


  select(index){
    this.delete = true;
    this.login.patchValue(this.db[index]);
    CacheDataService.setClientId(this.db[index]._id);
  }

  deleteElement(){
    this.delete = false;
    var info = { tabla : "intermediarios",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.tabla = "intermediarios";

    if(!("_id" in formData) || formData._id == '' || formData._id == undefined){
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }


  showSearch(){
    if(!this.search)
      this.search = true;
    else
      this.onClickSearch();
  }


}
