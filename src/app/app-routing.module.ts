import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { ClientesComponent } from './clientes/clientes.component';

import { MultasComponent } from './multas/multas.component';
import { IntermediariosComponent } from './intermediarios/intermediarios.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { ContratosComponent } from './contratos/contratos.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { FlotaComponent } from './flota/flota.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { ListaComponent } from './lista/lista.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ProlongarComponent } from './prolongar/prolongar.component';
import { ListaContratoComponent } from './lista-contrato/lista-contrato.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'clientes',
    pathMatch: 'full',
    component: ClientesComponent
  },
  {
    path: 'intermediarios',
    pathMatch: 'full',
    component: IntermediariosComponent
  },
  {
    path: 'multas',
    component: MultasComponent
  },
  {
    path: 'operadores',
    pathMatch: 'full',
    component: OperadoresComponent
  },
  {
    path: 'contratos',
    pathMatch: 'full',
    component: ContratosComponent
  },
  {
    path: 'vehiculos',
    pathMatch: 'full',
    component: VehiculosComponent
  },
  {
    path: 'flota',
    pathMatch: 'full',
    component: FlotaComponent
  },
  {
    path: 'contabilidad',
    pathMatch: 'full',
    component: ContabilidadComponent
  },
  {
    path: 'listas',
    pathMatch: 'full',
    component: ListaComponent
  },
  {
    path: 'reservas',
    pathMatch: 'full',
    component: ReservasComponent
  },
  {
    path: 'prolongar',
    pathMatch: 'full',
    component: ProlongarComponent
  },
  {
    path:'listaContrato',
    pathMatch: 'full',
    component: ListaContratoComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
