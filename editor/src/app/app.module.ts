import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppRoutingModule } from './app-routing.module';
import { SitesModule } from './sites/sites.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppState } from './app-state/app.state';
import { HeaderComponent } from './header/header.component';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';
import { LoginComponent } from './login/login.component';
import { UserState } from './user/user.state';
import { UserAccountComponent } from './user/user-account.component';
import { SitesSharedModule } from './sites/shared/sites-shared.module';
import { PopupComponent } from './popup/popup.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    ProfileDropdownComponent,
    UserAccountComponent,
    LoginComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxsModule.forRoot([
      AppState,
      UserState
    ], { developmentMode: isDevMode() }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: !isDevMode() }),
    NgxsLoggerPluginModule.forRoot({ disabled: true }),  // it logs too much, enable only when needed
    SitesModule,
    SitesSharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
