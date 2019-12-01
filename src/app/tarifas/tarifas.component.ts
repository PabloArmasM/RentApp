import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.scss']
})
export class TarifasComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;

  login: FormGroup;
  _id : any;

  constructor(private formBuilder: FormBuilder, private cache : CacheDataService, private data: DatProviderService) {

  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            igic: ['', Validators.required],
            seguroCoche: ['', Validators.required],
            seguroPersonal: ['', Validators.required],
            A: ['', Validators.required],
            B: ['', Validators.required],
            C: ['', Validators.required],
            D: ['', Validators.required],
            E: ['', Validators.required],
            F: ['', Validators.required],
            G: ['', Validators.required],
            H: ['', Validators.required],
            I: ['', Validators.required]
        });
  }

  ngAfterViewInit(){
    var data = {tabla : 'tarifas'}
    this.data.getData(JSON.stringify(data)).subscribe(res => {
      console.log(res);
      this.login.patchValue(res[0]);
      this._id = res[0]._id;
    });
  }

  keytab(pos, extra = 0){
    if(pos == -1){
      var lastElement : any = this.questions.last;
      lastElement.nativeElement.focus();
    }else{
      var elements : Array<any> = this.questions.toArray();
      elements[pos + extra].nativeElement.focus();
    }
  }

  onClickSubmit(){
    if(!confirm("Se va a guardar la información"))
      return;
    //this.printData();
    if(this.login.valid){
      var formData = this.login.value;
      formData.tabla = "tarifas";
      formData._id = this._id;
      console.log(formData);
      this.data.updateData(formData).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }

}
