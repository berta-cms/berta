import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSectionsComponent } from './sites/sections/site-sections.component';
import { LoginComponent } from './login/login.component';
import { SitesComponent } from './sites/sites.component';
import { SiteSettingsComponent } from './sites/settings/site-settings.component';
import { SiteTemplateSettingsComponent } from './sites/template-settings/site-template-settings.component';
import { UserAccountComponent } from './user/user-account.component';


const routes: Routes = [
  {
    path: 'multisite',
    component: SitesComponent
  },
  {
    path: 'sections',
    component: SiteSectionsComponent
  },
  {
    path: 'settings',
    component: SiteSettingsComponent
  },
  {
    path: 'design',
    component: SiteTemplateSettingsComponent
  },
  {
    path: 'account',
    component: UserAccountComponent
  },
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopModule',
  },
  {
    path: 'login',
    component: LoginComponent
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
