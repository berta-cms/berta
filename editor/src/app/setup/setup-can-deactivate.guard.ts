import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { SetupWizardComponent } from './setup-wizard.component';

@Injectable({
  providedIn: 'root',
})
export class SetupCanDeactivateGuard
  implements CanDeactivate<SetupWizardComponent>
{
  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(AppState.isSetup).pipe(
      take(1),
      map((isSetup) => !isSetup),
    );
  }
}
