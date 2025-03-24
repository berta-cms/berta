import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { take, catchError, filter, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { AppStateService } from '../../app-state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private store: Store,
    private http: HttpClient,
    private appStateService: AppStateService
  ) {}

  upload(urlName: string, data) {
    const formData = new FormData();
    formData.append('path', data.path);
    formData.append('value', data.value);

    return combineLatest(
      this.store.select((state) => state.app),
      this.store.select((state) => state.user)
    ).pipe(
      filter(
        ([appState, user]) =>
          !!user.token && (appState.urls[urlName] || urlName)
      ),
      take(1),
      switchMap(([appState, user]) => {
        this.appStateService.showLoading();

        return this.http.post<any>(
          appState.urls[urlName] || urlName,
          formData,
          {
            headers: { 'X-Authorization': 'Bearer ' + user.token },
          }
        );
      }),
      tap(() => {
        this.appStateService.hideLoading();
      }),
      catchError((error) => {
        this.appStateService.hideLoading();
        throw error;
      })
    );
  }
}
