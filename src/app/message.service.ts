import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message = {type: 'success',
                    message: 'La información se ha actualizado satisfactoriamente'};
  activate = false;
  constructor() { }


  addAlert(message){
    this.activate = true;
    this.message = message;
  }

  closeAlert(){
    this.activate = false;
  }
}
