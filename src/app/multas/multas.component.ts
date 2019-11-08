import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.scss']
})
export class MultasComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  login: FormGroup;
  recibe = false;
  inputs: any;
  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};


  constructor(private formBuilder: FormBuilder, private data : DatProviderService) { }

  ngOnInit() {
    this.login = this.formBuilder.group({
            fecha : [''],
            matricula : ['']
        });
  }

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  addAlert(message){
    this.activate = true;
    this.message = message;
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.fecha = new Date(formData.fecha).getTime();
    this.data.searchMulta(formData).subscribe(res =>{
      if(res.hasOwnProperty('type')){
        this.addAlert(res);
        return;
      }
      this.recibe = true;
      this.inputs = res;
      console.log(res);
    });
  }
}
