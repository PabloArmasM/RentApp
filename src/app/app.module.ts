import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';
import {MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule } from '@angular/material';
import { ThermalPrintModule } from 'ng-thermal-print';

// NG Translates
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

import {MatGridListModule} from '@angular/material/grid-list';
import {CdkTableModule} from '@angular/cdk/table';

import { ClientesComponent } from './clientes/clientes.component';
import { MultasComponent } from './multas/multas.component';
import { IntermediariosComponent } from './intermediarios/intermediarios.component';


import { CacheDataService } from './cache-data.service'
import { DatProviderService } from './dat-provider.service';
import { BuilderCalendarService } from './builder-calendar.service';
import { OperadoresComponent } from './operadores/operadores.component';
import { ContratosComponent } from './contratos/contratos.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { FlotaComponent } from './flota/flota.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { ListaComponent } from './lista/lista.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ProlongarComponent } from './prolongar/prolongar.component';
import { ListaContratoComponent } from './lista-contrato/lista-contrato.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent, ClientesComponent, MultasComponent, IntermediariosComponent, OperadoresComponent, ContratosComponent, VehiculosComponent, FlotaComponent, ContabilidadComponent, ListaComponent, ReservasComponent, ProlongarComponent, ListaContratoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    ThermalPrintModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ DatProviderService,
    CacheDataService,
    BuilderCalendarService
   ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
