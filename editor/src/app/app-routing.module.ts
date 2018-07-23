import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSectionsComponent } from './sites/sections/site-sections.component';
import { LoginComponent } from './login/login.component';
import { SitesComponent } from './sites/sites.component';
import { SiteSettingsComponent } from './sites/settings/site-settings.component';


const routes: Routes = [
  {
    path: 'sections',
    component: SiteSectionsComponent
  },
  {
    path: 'settings',
    component: SiteSettingsComponent
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
