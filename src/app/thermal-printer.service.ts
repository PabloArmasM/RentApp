import { Injectable } from '@angular/core';
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';


@Injectable({
  providedIn: 'root'
})
export class ThermalPrinterService {

  status: boolean = false;
  usbPrintDriver: UsbDriver;
  webPrintDriver: WebPrintDriver;
  ip: string = '';

  constructor(private printService: PrintService) {
    this.usbPrintDriver = new UsbDriver();
        this.printService.isConnected.subscribe(result => {
            this.status = result;
            if (result) {
                console.log('Connected to printer!!!');
            } else {
            console.log('Not connected to printer.');
            }
        });
  }

  requestUsb() {
        this.usbPrintDriver.requestUsb().subscribe(result => {
            this.printService.setDriver(this.usbPrintDriver, 'ESC/P2');
        });
    }


    print() {
        this.printService.init()
            .setBold(true)
            .writeLine('Hello World!')
            .setBold(false)
            .feed(4)
            .cut('full')
            .flush();
    }
}
