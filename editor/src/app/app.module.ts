import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { ThemesComponent } from './themes/themes.component'
import { UserState } from './user/user.state';
import { UserAccountComponent } from './user/user-account.component';
import { SitesSharedModule } from './sites/shared/sites-shared.module';
import { PreviewComponent } from './preview/preview.component';
import { PopupComponent } from './popup/popup.component';
import { ErrorState } from './error-state/error.state';
import { SharedModule } from './shared/shared.module';
import { SentryErrorHandler } from './sentry.error-handler';
import { StyleService } from './preview/style.service';
import { WhiteTemplateStyleService } from './preview/white-template-style.service';
import { DefaultTemplateStyleService } from './preview/default-template-style.service';
import { MashupTemplateStyleService } from './preview/mashup-template-style.service';


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
    PopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot([
      AppState,
      UserState,
      ErrorState
    ], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: true }),  // it logs too much, enable only when needed
    SitesModule,
    SitesSharedModule
  ],
  providers: [
    StyleService,
    WhiteTemplateStyleService,
    DefaultTemplateStyleService,
    MashupTemplateStyleService,
    {provide: ErrorHandler, useClass: SentryErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
