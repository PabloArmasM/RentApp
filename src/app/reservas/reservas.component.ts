import { Component, OnInit, ViewChild, ElementRef, ViewChildren,  QueryList  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import { DatProviderService } from '../dat-provider.service';
import { CacheDataService } from '../cache-data.service';
import { ThermalPrinterService } from '../thermal-printer.service';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  @ViewChildren('inputs') questions: QueryList<'inputs'>;
  @ViewChildren('searchs') searchsInputs: QueryList<'searchs'>;


  login: FormGroup;
  searchForm : FormGroup;
  submitted = false;
  tipoPago = "efectivo";

  file = "";
  search = false;
  recibe = false;
  updateCar = false;
  delete = false;
  readyToPrint = false;

  db: any[] = [];

  constructor(private formBuilder: FormBuilder, private cache : CacheDataService, private data: DatProviderService, private printer: ThermalPrinterService) {

  }

  ngOnInit() {
    this.login = this.formBuilder.group({
            _id: [''],
            clientCode: [''],
            grupo: [''],
            operador: [''],
            sucursal: [''],
            intermediario: [''],
            fechaReserva: [''],
            fechaEntrada: [''],
            fechaSalida: [''],
            posVehiculo: [''],
            posFinalVehiculo: [''],
            observaciones: [''],
        });
        this.searchForm = this.formBuilder.group({
          _id: [''],
          clientCode: [''],
        });
  }



  ngAfterViewInit(){

    var date = new Date();
    var fecha = this.formatDate(date);
    this.login.patchValue({fechaEntrada : fecha});

    console.log(fecha);
    this.login.patchValue({clientCode : CacheDataService.getClientId()});


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

  keytabSearch(pos){
    var elements : Array<any> = this.searchsInputs.toArray();
    elements[pos].nativeElement.focus();
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

  get f() { return this.login.controls; }
  get t() { return this.f.inputs as FormArray; }

  onClickAdd(){
    this.t.push(this.formBuilder.group({
                    name: ['', Validators.required],
                }));
  }

  showSearch(){
    if(!this.search)
      this.search = true;
    else
      this.onClickSearch();
  }


  onClickSearch(){
    var info = this.cache.clean(this.searchForm.value);
    info.tabla = "reservas";
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
        this.delete = true;
        this.readyToPrint = true;
        this.updateCar = true;
        var info = res[0];
        info.fechaSalida = this.formatDate(new Date(info.fechaSalida));
        info.fechaEntrada = this.formatDate(new Date(info.fechaEntrada));

        this.login.patchValue(info);

        var inputs = info.inputs;
        info.inputs.forEach(elementos => {
          console.log(elementos);
        })
        for(var i = 0; i< info.inputs.length; i++){
          debugger;
          this.t.push(this.formBuilder.group({
                          name: [inputs[i].name, Validators.required],
                      }));
        }
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
    this.readyToPrint = true;
    this.login.patchValue(this.db[index]);
    CacheDataService.setClientId(this.db[index]._id);
  }

  cambio(value){
    this.tipoPago = value;
  }

  calculatePrice(){
    var dias = (1000*60*60*24);
    var entrada = new Date(this.login.value.fechaEntrada).getTime();
    var salida = new Date(this.login.value.fechaSalida).getTime();
    var aCobrar = Math.round(Math.abs(salida - entrada)/dias)*28;
    this.login.patchValue({precio : aCobrar});
  }

  updateTerms(){
    this.login.patchValue({
      _id : "",
      grupo : "",
      precio : "",
      matricula : "",
      fechaEntrada : this.login.value.fechaSalida,
      fechaSalida : "",
      gasolina : ""
    });
  }

  deleteElement(){
    this.delete = false;
    this.readyToPrint = false;
    var info = { tabla : "reservas",
      _id : this.login.value._id};
    this.data.delete(info).subscribe(res =>{
      this.login.patchValue(res);
    });
  }

  onClickSubmit(){
    //this.printData();
    var formData = this.login.value;
    formData.tabla = "reservas";
    formData.fechaEntrada = new Date(formData.fechaEntrada).getTime();
    formData.fechaSalida = new Date(formData.fechaSalida).getTime();

    if(!("_id" in formData) || formData._id == '' || formData._id == undefined){
      console.log("Se supone que esta vacio");
      var inputs = this.login.value.inputs;
      delete formData.inputs;
      var element: any[] = [];
      for(var i = 0; i < inputs.length; i++){
        element.push(inputs[i].name);
      }
      formData.inputs = element;
      this.data.addData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
        this.readyToPrint = true;
        this.data.updateState({matricula : this.login.value.matricula, fechaSalida : formData.fechaSalida,
                              fechaEntrada : formData.fechaEntrada, grupo: this.login.value.grupo, status: 1}).subscribe(res=>{
          console.log(res);
        });
      });
    }else{
      console.log(formData);
      this.data.updateData(JSON.stringify(formData)).subscribe(res =>{
        this.login.patchValue(res);
      });
    }
  }


  printData(){
    // epson LQ 500 ESC/P 2 Ver 2.0
    this.printer.requestUsb();
    this.printer.print();
  }


}
