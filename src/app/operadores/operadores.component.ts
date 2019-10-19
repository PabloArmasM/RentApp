import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss']
})
export class OperadoresComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;

  login: FormGroup;

  constructor(private data: DatProviderService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            name: [''],
        });
  }

  keytab(pos){
    var elements : Array<any> = this.questions.toArray();
    elements[pos].nativeElement.focus();
  }

  onClickSubmit(){//Editar
    var formData = this.login.value;
    formData.tabla = "operadores";
    this.data.addData(JSON.stringify(formData));
  }
}
