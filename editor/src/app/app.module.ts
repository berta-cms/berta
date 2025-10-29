import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { SitesModule } from './sites/sites.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppState } from './app-state/app.state';
import { HeaderComponent } from './header/header.component';
import { PreviewToggleComponent } from './header/preview-toggle.component';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';
import { LoginComponent } from './login/login.component';
import { ThemesComponent } from './themes/themes.component';
import { UserState } from './user/user.state';
import { UserAccountComponent } from './user/user-account.component';
import { SitesSharedModule } from './sites/shared/sites-shared.module';
import { PreviewComponent } from './preview/preview.component';
import { PopupComponent } from './popup/popup.component';
import { ErrorState } from './error-state/error.state';
import { SharedModule } from './shared/shared.module';
import { StyleService } from './preview/style.service';
import { WhiteTemplateStyleService } from './preview/white-template-style.service';
import { DefaultTemplateStyleService } from './preview/default-template-style.service';
import { MashupTemplateStyleService } from './preview/mashup-template-style.service';
import { MessyTemplateStyleService } from './preview/messy-template-style.service';
import { SiteSectionsModule } from './sites/sections/site-sections.module';
import { ShopSettingsState } from './shop/settings/shop-settings.state';
import { ShopRegionalCostsState } from './shop/regional-costs/shop-regional-costs.state';
import { SiteMediaModule } from './sites/media/site-media.module';
import { SentryConfigService } from './sentry/sentry-config.service';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { sentryInitFactory } from './sentry/sentry-init.factory';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    PreviewToggleComponent,
    ProfileDropdownComponent,
    UserAccountComponent,
    LoginComponent,
    PreviewComponent,
    ThemesComponent,
    PopupComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot(
      [
        AppState,
        UserState,
        ErrorState,
        ShopSettingsState,
        ShopRegionalCostsState,
      ],
      {
        developmentMode: !environment.production,
      },
    ),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: true }), // it logs too much, enable only when needed
    SitesModule,
    SitesSharedModule,
    SiteSectionsModule,
    SiteMediaModule,
  ],
  providers: [
    SentryConfigService,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
        logErrors: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: sentryInitFactory,
      deps: [SentryConfigService, Router],
      multi: true,
    },
    StyleService,
    WhiteTemplateStyleService,
    DefaultTemplateStyleService,
    MashupTemplateStyleService,
    MessyTemplateStyleService,
    { provide: APP_BASE_HREF, useValue: '/engine/' },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
