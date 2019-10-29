import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import {Router, NavigationEnd} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  header = true;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private activeRoute:Router
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode deas');
    }
  }

  ngOnInit() {
   this.activeRoute.events.subscribe(this.onUrlChange.bind(this))
 }

  onUrlChange(ev) {
    if(ev instanceof NavigationEnd) {
      console.log(ev);
      let url = ev.url;
      if(url.indexOf('/calendario') != -1 || url.indexOf('/listaContrato') != -1)  {
          this.header = false;
      } else {
        this.header = true;
      }

    }
  }
}
