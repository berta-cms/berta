import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSectionsComponent } from './sites/sections/site-sections.component';
import { LoginComponent } from './login/login.component';
import { SitesComponent } from './sites/sites.component';
import { SiteSettingsComponent } from './sites/settings/site-settings.component';
import { SiteTemplateSettingsComponent } from './sites/template-settings/site-template-settings.component';
import { UserAccountComponent } from './user/user-account.component';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  {
    path: 'multisite',
    component: SitesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sections',
    component: SiteSectionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'settings/:group',
    component: SiteSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'settings',
    component: SiteSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'design/:group',
    component: SiteTemplateSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'design',
    component: SiteTemplateSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'account',
    component: UserAccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopModule',
    /** Can load appears not to be working correctly. @todo: update Angular, see if it helps */
    // canLoad: [AuthGuardService],
    canActivate: [AuthGuardService]
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
