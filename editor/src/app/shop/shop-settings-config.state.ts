import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from './shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { AppStateModel } from '../app-state/app-state.interface';

interface ShopSettingsConfigModel {
  [site: string]: any;
}

const defaultState: ShopSettingsConfigModel = {};


@State<ShopSettingsConfigModel>({
  name: 'shopSettingsConfig',
  defaults: defaultState
})
export class ShopSettingsConfigState implements NgxsOnInit {

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopSettingsConfigModel>) {
    return this.stateService.getInitialState('', 'settingsConfig').pipe(
      take(1)
    ).subscribe((settingsConfig) => {
      setState(settingsConfig);
    });
  }
}
