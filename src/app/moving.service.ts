import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovingService {

  constructor() { }

  keytab(focus, pos){
    var elements : Array<any> = focus.toArray();
    elements[pos].nativeElement.focus();
  }

}
