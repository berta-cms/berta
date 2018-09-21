import { take } from 'rxjs/operators';
import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';

import { ShopModel } from './shop.interface';
import { ShopStateService } from './shop-state.service';


const defaultState: ShopModel = {
  sections: [],
  urls: {}
};


@State<ShopModel>({
  name: 'shop',
  defaults: defaultState
})
export class ShopState implements NgxsOnInit {

  @Selector()
  static getSections(state: ShopModel): Array<string> {
    return state.sections;
  }

  @Selector()
  static getURLs(state: ShopModel) {
    return state.urls;
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ patchState }: StateContext<ShopModel>) {
    return this.stateService.getInitialState().pipe(
      take(1)
    ).subscribe((state) => {
      patchState({
        sections: Object.keys(state).filter(key => {
          return Object.keys(defaultState).indexOf(key) === -1 && !(/config$/i.test(key));
        }),
        urls: state.urls
      });
    });
  }
}
