import { take, map, pairwise, filter } from 'rxjs/operators';
import { State, StateContext, NgxsOnInit, Selector, Store } from '@ngxs/store';

import { ShopModel } from './shop.interface';
import { ShopStateService } from './shop-state.service';
import { SitesState } from '../sites/sites-state/sites.state';
import {
  RenameShopRegionSiteAction,
  DeleteShopRegionSiteAction,
  AddShopRegionSiteAction } from './regional-costs/shop-regional-costs.actions';


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
    private store: Store,
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ patchState }: StateContext<ShopModel>) {
    this.store.select(SitesState).pipe(
      filter(sites => !!sites && sites.length > 0),
      map(sites => sites.map(site => site.name)),
      pairwise(),
      map(([prevSiteNames,
        siteNames]) => {
        let leftOverPrevSiteNames = prevSiteNames;
        const newSiteName = siteNames.reduce((_newSiteName, siteName) => {
          if (leftOverPrevSiteNames.indexOf(siteName) === -1) {
            return siteName;
          }
          leftOverPrevSiteNames = leftOverPrevSiteNames.filter(sn => sn !== siteName);
          return _newSiteName;
        }, null);

        return [leftOverPrevSiteNames[0], newSiteName];
      }),
      filter((oldSiteName, newSiteName) => !!oldSiteName || !!newSiteName)
    ).subscribe(([oldSiteName, newSiteName]) => {
      if (oldSiteName && newSiteName) {
        this.store.dispatch(new RenameShopRegionSiteAction(oldSiteName, newSiteName));
      } else if (oldSiteName) {
        // Site was deleted - delete settings for the site
        this.store.dispatch(new DeleteShopRegionSiteAction(oldSiteName));
      } else if (newSiteName) {
        // Site was created - get the data from server
        this.store.dispatch(new AddShopRegionSiteAction(newSiteName));
      }
    });

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
