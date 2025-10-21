import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { firstValueFrom, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppStateModel } from '../app-state/app-state.interface';
import {
  AppHideLoading,
  AppShowLoading,
  UpdateInputFocus,
} from '../app-state/app.actions';
import { AppState } from '../app-state/app.state';
import { PopupService } from '../popup/popup.service';
import { UserLoginAction } from '../user/user.actions';
import { UserState } from '../user/user.state';

@Component({
  selector: 'berta-login',
  template: `
    @if (appState$ | async; as appState) {
      @if (!(isLoggedIn$ | async)) {
        <div class="login-container setting-group">
          <h3><img src="/engine/layout/berta.png" /></h3>
          @if (isLoading$ | async) {
            <div class="bt-login-loading">
              <berta-loading></berta-loading>
            </div>
          } @else {
            @if (appState.isBertaHosting) {
              <div class="form-group social-login">
                <a
                  href="{{ appState.loginUrl }}?remote_redirect={{
                    appState.authenticateUrl
                  }}&amp;provider=facebook"
                  class="button facebook"
                >
                  <bt-icon-facebook></bt-icon-facebook>
                  <p>Log in with Facebook</p></a
                >
                <a
                  href="{{ appState.loginUrl }}?remote_redirect={{
                    appState.authenticateUrl
                  }}&amp;provider=google"
                  class="button google"
                >
                  <bt-icon-google></bt-icon-google>
                  <p>Sign in with Google</p></a
                >
                <p>or</p>
              </div>
            }
            @if (message) {
              <div class="error-message">{{ message }}</div>
            }
            <form
              [attr.action]="
                appState.isBertaHosting
                  ? appState.loginUrl +
                    '?remote_redirect=' +
                    appState.authenticateUrl
                  : null
              "
              method="post"
              (submit)="login($event)"
            >
              <berta-text-input
                [placeholder]="'Username'"
                [name]="'auth_user'"
                [value]="username"
                [enabledOnUpdate]="true"
                [hideIcon]="true"
                (inputFocus)="updateComponentFocus($event)"
                (update)="updateField('username', $event)"
              ></berta-text-input>
              <berta-text-input
                [placeholder]="'Password'"
                [name]="'auth_pass'"
                [value]="password"
                [type]="'password'"
                [enabledOnUpdate]="true"
                [hideIcon]="true"
                (inputFocus)="updateComponentFocus($event)"
                (update)="updateField('password', $event)"
              ></berta-text-input>
              <div class="form-group buttons">
                <button type="submit" class="button">Log in</button>
                <a href="{{ appState.forgotPasswordUrl }}" target="_blank"
                  >Forgot password?</a
                >
              </div>
            </form>
          }
          <div class="footer">
            <span>berta {{ appState.version }}</span>
            <span>2008 - {{ currentYear }}</span>
          </div>
        </div>
      }
    }
  `,
  standalone: false,
})
export class LoginComponent implements OnInit {
  message: string;
  username: string;
  password: string;
  currentYear: number;
  isLoggedIn$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  appState$: Observable<AppStateModel>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.store.select(UserState.isLoggedIn);
    this.isLoading$ = this.store.select(AppState.getShowLoading);
    this.appState$ = this.store.select((state) => state.app);
    this.username = '';
    this.password = '';
    this.message = '';
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params.autherror) {
        this.message = 'Incorrect Username or password!';
      }
    });
  }

  updateField(field: 'username' | 'password', value: string) {
    this[field] = value;
  }

  updateComponentFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  async login(event: SubmitEvent) {
    const isBertaHosting = (await firstValueFrom(this.appState$))
      .isBertaHosting;

    if (isBertaHosting) {
      return true;
    }

    event.preventDefault();
    this.store.dispatch(new AppShowLoading());

    this.store
      .dispatch(
        new UserLoginAction({
          username: this.username,
          password: this.password,
        }),
      )
      .subscribe({
        next: () => {
          this.message = 'Login Successful';
          this.popupService.showPopup({
            type: 'success',
            content: this.message,
            timeout: 1000,
            onTimeout: (popupService) => {
              this.store.dispatch(new AppHideLoading());
              popupService.closePopup();
            },
          });
        },
        error: (error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.message = 'Incorrect Username or password!';
          } else {
            this.message = error.message;
          }
          this.popupService.showPopup({
            type: 'error',
            content: this.message,
            timeout: 2000,
            onTimeout: (popupService) => {
              this.store.dispatch(new AppHideLoading());
              popupService.closePopup();
            },
          });
        },
      });
  }
}
