import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SectionsComponent } from './sections/sections.component';
import { LoginComponent } from './login/login.component';
import { SitesComponent } from './sites/sites.component';


const routes: Routes = [
  {
    path: 'sections',
    component: SectionsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'multisite',
    component: SitesComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
