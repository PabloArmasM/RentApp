import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss']
})
export class OperadoresComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;

  login: FormGroup;
  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};

  print = new MatTableDataSource();
  colNames = ["_id", "name"];
  head = {_id : "ID", name : "Nombre" };

  delete = false;


  constructor(private data: DatProviderService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            name: [''],
        });
    this.refresh();
  }

  addAlert(message){
    this.activate = true;
    this.message = message;
  }

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  refresh(){
    var toSearch = {tabla : "operadores"};
    this.data.getData(toSearch).subscribe(res => {
      this.print = new MatTableDataSource(res);
    });
  }

  applyFilter(filterValue: string) {
      this.print.filter = filterValue.trim().toLowerCase();
    }

  caca(i){
    console.log(this.print.data[i]);
    this.login.patchValue(this.print.data[i]);
    this.delete = true;
  }


  close() {
    this.activate = false;
  }


  deleteElement(){
    if(!confirm("¿Está seguro de que desea eliminarlo?"))
      return;
    this.delete = false;
    var info = { tabla : "operadores",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.addAlert(res);
      this.refresh();
    });
  }



  onClickSubmit(){//Editar
    var formData = this.login.value;
    formData.tabla = "operadores";
    if(Object.keys(this.print.data).includes(''+this.login.value._id)){
      this.data.updateOp(formData).subscribe(res =>{
        debugger;
        //this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
        this.refresh();

      });
    }else if(this.login.value._id >= 0 && this.login.value._id != '' && this.login.value._id != null && this.login.value._id != undefined){
      debugger;
      this.data.addOp(formData).subscribe(res =>{
        this.addAlert(res.message);
        this.refresh();
      });
    }else{
      this.data.addData(formData).subscribe(res =>{
        this.login.patchValue({_id : res._id});
        this.addAlert(res.message);
        this.refresh();
      });
    }


  }
}
