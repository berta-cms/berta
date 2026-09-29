import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequirementsResponse } from './server-requirements.interface';

@Injectable({
  providedIn: 'root',
})
export class ServerRequirementsService {
  constructor(private http: HttpClient) {}

  check(): Observable<RequirementsResponse> {
    return this.http
      .get<RequirementsResponse>('/_api/v1/requirements')
      .pipe(
        catchError((error: HttpErrorResponse) =>
          of(this.getErrorResponse(error)),
        ),
      );
  }

  /** Fresh on every call, the site gets installed during the session */
  isNotInstalled(): Observable<boolean> {
    return this.check().pipe(map((response) => response.installed === false));
  }

  /**
   * The API answers with the requirements payload even when Laravel can't
   * boot (see `_api_app/bootstrap/requirements_guard.php`). Any other error
   * may be temporary (network, proxy) and also happens on installed sites, so
   * it is reported as a dismissible warning instead of blocking the editor.
   */
  private getErrorResponse(error: HttpErrorResponse): RequirementsResponse {
    if (Array.isArray(error.error?.requirements)) {
      return error.error as RequirementsResponse;
    }

    return {
      installed: null,
      requirements: [
        {
          key: 'api',
          group: 'server',
          label: 'Server requirements checked',
          ok: false,
          fatal: false,
          message:
            'Berta could not check the server requirements' +
            (error.status ? ` (error ${error.status})` : '') +
            ". If the editor doesn't work, check the server's PHP error log.",
        },
      ],
    };
  }
}
