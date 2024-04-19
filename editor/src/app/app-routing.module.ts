import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSectionsComponent } from './sites/sections/site-sections.component';
import { LoginComponent } from './login/login.component';
import { ThemesComponent } from './themes/themes.component';
import { SitesComponent } from './sites/sites.component';
import { SiteSettingsComponent } from './sites/settings/site-settings.component';
import { SiteTemplateSettingsComponent } from './sites/template-settings/site-template-settings.component';
import { UserAccountComponent } from './user/user-account.component';
import { AuthGuardService } from './auth-guard.service';
import { SiteMediaComponent } from './sites/media/site-media.component';
import { EntryGalleryEditorComponent } from './sites/media/entry-gallery-editor.component';
import { EntryGalleryImageEditorComponent } from './sites/media/entry-gallery-image-editor.component';

const routes: Routes = [
  {
    path: 'multisite',
    component: SitesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'sections/:section',
    component: SiteSectionsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'sections',
    component: SiteSectionsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'settings/:group',
    component: SiteSettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'settings',
    component: SiteSettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'themes',
    component: ThemesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'design/:group',
    component: SiteTemplateSettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'design',
    component: SiteTemplateSettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'media',
    component: SiteMediaComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'media/gallery/:section/:entry_id',
    component: EntryGalleryEditorComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'media/image/:section/:entry_id/:image_order',
    component: EntryGalleryImageEditorComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'account',
    component: UserAccountComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
    /** Can load appears not to be working correctly. @todo: update Angular, see if it helps */
    // canLoad: [AuthGuardService],
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
