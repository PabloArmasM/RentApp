import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
    })
}

@Injectable({
  providedIn: 'root'
})
export class DatProviderService {

  uri = 'http://localhost:3000';
  //uri = 'http://192.168.1.44:3000';

    constructor(private http: HttpClient) { }


    getData(info){
      console.log(info);
      return this.http.post<any>(this.uri+'/search/', info, httpOptions);
    }

    addData(data) {
      console.log("addData");
      return this.http.post<any>(this.uri+'/add', data, httpOptions);
    }

    updateData(data) {
      console.log("updateData");
      return this.http.post<any>(this.uri+'/update', data, httpOptions);
    }

    delete(data){
      return this.http.post<any>(this.uri+'/delete', data, httpOptions);
    }

    searchMulta(data){
      return this.http.post<any>(this.uri+'/multa', data, httpOptions);
    }

    addVehiculeRutine(data){

      console.log("EYYY");
      return this.http.post<any>(this.uri+'/stateVehicle', data, httpOptions);
    }

    updateState(data){
      return this.http.post<any>(this.uri+'/updateState', data, httpOptions);
    }

    getVehicleStatus(data){
      return this.http.post<any>(this.uri+'/getVehicleStatus', data, httpOptions);
    }
}
