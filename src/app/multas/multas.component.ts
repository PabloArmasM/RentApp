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
  toPrint: FormGroup;
  recibe = false;
  inputs: any;
  activate = false;
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};
  ready = false;
  //socket : WebSocket = new WebSocket("ws://localhost:9000");



  constructor(private formBuilder: FormBuilder, private data : DatProviderService) {
      /*this.socket.onmessage = function(e) {
        console.log('Message:', e.data);
      };

      this.socket.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
          this.socket = new WebSocket("ws://localhost:9000");
        }, 1000);
      };*/
   }

  ngOnInit() {
    this.login = this.formBuilder.group({
            fecha : [''],
            matricula : ['']
        });

    this.toPrint = this.formBuilder.group({
      expediente : [''],
      matricula : [''],
      fecha : [''],
      marca : [''],
      nombre : [''],
      dni : [''],
      domicilio : [''],
      domLocal : [''],
      fechaFoot : ['']
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

  amos(){
    var data = {hola : "que fue bandido?"};
    this.data.printMulta(data).subscribe(res => {
      console.log(res);
    });
  }

  formatDate(date){
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);


    return (year + "-" + month + "-" + day);
  }

  onClickSubmit(){
    var formData = this.login.value;
    formData.fecha = new Date(formData.fecha).getTime();
    this.data.searchMulta(formData).subscribe(res =>{
      if(res.hasOwnProperty('type')){
        this.addAlert(res);
        this.inputs = res;
        return;
      }else{
        this.toPrint.patchValue({
          matricula : res.matricula,
          domLocal : res.lugar,
          fecha : this.formatDate(new Date(this.login.value.fecha)),
          fechaFoot : this.formatDate(new Date())
        });
        this.data.getData({ tabla : "clientes", _id : res.clientCode }).subscribe(rez => {
          var info = rez[0];
          this.toPrint.patchValue({
            nombre : info.nombre + " " + info.apellidos,
            dni : info.dni,
            domicilio : info.direccion,
          });
          console.log(rez);
        });

        this.data.getData({ tabla : "vehiculos", matricula : res.matricula }).subscribe(rez =>{
          var info = rez[0];
          this.toPrint.patchValue({
            marca : info.modelo
          });
          console.log(rez);
        });
        this.ready = true;

        console.log(res);
      }
    });
  }

  /*ngOnDestroy() {
    this.socket.close();
  }*/



print(){
    this.data.printMulta(this.toPrint.value).subscribe(res =>{
      console.log(res);
    });
    //this.socket.send("Esto es una puta mierda de verdad yo no se para que mierda ponen de pago el java11 me cago en sus putas madres ahora me voy a aher un perfil de mierda para putearlos");
}
}
