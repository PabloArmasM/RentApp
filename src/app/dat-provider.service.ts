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
  //uri = 'http://192.168.165.250:3000';
  //printUri = 'http://localhost:8000';
  printUri = 'http://192.168.165.251';
  //printUri = 'http://localhost';




    constructor(private http: HttpClient) { }

    capitalizar(data){
      var keys = Object.keys(data);
      keys.forEach(key =>{
        if(typeof data[key] === "string" && key != 'tabla'){
          data[key] = data[key].toUpperCase();
        }
      });
      return data;
    }


    getData(info){
      console.log(info);
      return this.http.post<any>(this.uri+'/search/', JSON.stringify(this.capitalizar(info)), httpOptions);
    }


    addOp(data) {
      console.log("addData");
      return this.http.post<any>(this.uri+'/addOP',JSON.stringify(this.capitalizar(data)), httpOptions);
    }


    addData(data) {
      console.log("addData");
      return this.http.post<any>(this.uri+'/add',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    updateOp(data) {
      console.log("updateData");
      return this.http.post<any>(this.uri+'/updateOP',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    updateData(data) {
      console.log("updateData");
      return this.http.post<any>(this.uri+'/update',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    delete(data){
      return this.http.post<any>(this.uri+'/delete',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    searchMulta(data){
      return this.http.post<any>(this.uri+'/multa',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    addVehiculeRutine(data){

      console.log("EYYY");
      return this.http.post<any>(this.uri+'/stateVehicle',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    updateState(data){
      return this.http.post<any>(this.uri+'/updateState',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    getVehicleStatus(data){
      return this.http.post<any>(this.uri+'/getVehicleStatus',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    dayRange(data){
      return this.http.post<any>(this.uri+'/dayRange',JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    printMulta(data){
      return this.http.post<any>(this.printUri+":8000",JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    printContrato(data){
      debugger;
      return this.http.post<any>(this.printUri+":8001",JSON.stringify(this.capitalizar(data)), httpOptions);
    }

    printReservas(data){
      return this.http.post<any>(this.printUri+":8002", JSON.stringify(data), httpOptions);
    }
}
