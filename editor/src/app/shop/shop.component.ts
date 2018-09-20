import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopState } from './shop.state';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { splitCamel, camel2Words, uCFirst } from '../shared/helpers';


@Component({
  selector: 'berta-shop',
  template: `
    <div *ngFor="let settingsSection of settingsSections$ | async">
      <a [routerLink]="['/shop', settingsSection.urlSegment]"
         [style.color]="(currentSettingSection === settingsSection.urlSegment ? 'black': '')"><h3>{{ settingsSection.title }}</h3></a>

          <berta-shop-products
            *ngIf="currentSettingSection === 'products' && settingsSection.urlSegment === currentSettingSection">
          </berta-shop-products>
          <berta-shop-orders
            *ngIf="currentSettingSection === 'orders' && settingsSection.urlSegment === currentSettingSection">
          </berta-shop-orders>
          <berta-shop-regional-costs
            *ngIf="currentSettingSection === 'regional-costs' && settingsSection.urlSegment === currentSettingSection">
          </berta-shop-regional-costs>
          <berta-shop-settings
            *ngIf="currentSettingSection === 'settings' && settingsSection.urlSegment === currentSettingSection">
          </berta-shop-settings>

    </div>
  `,
  styles: [`
   :host > div > a {
     color: gray;
     text-decoration: none;
   }
  `]
})
export class ShopComponent implements OnInit {
  @Select(ShopState.getSections) shopSections$;
  @Select(state => state.app) appState$;

  currentSettingSection = '';
  settingsSections$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store) {
  }


  ngOnInit() {
    this.settingsSections$ = this.shopSections$.pipe(
      map((sectionSlugs: string[]) => {
        return sectionSlugs.map((sSlug) => {
          return {
            slug: sSlug,
            urlSegment: splitCamel(sSlug).map(slugPeace => slugPeace.toLowerCase()).join('-'),
            title: camel2Words(sSlug),
            data: {}
          };
        });
      }),
      mergeMap((sections: any[]) => {
        const obsArr = sections.map((section) => {
          return this.store.select((state) => {
            return state['shop' + uCFirst(section.slug)] && state['shop' + uCFirst(section.slug)][state.app.site];
          }).pipe(startWith(null), map(sd => {
            section.data = sd;
            return section;
          }));
        });
        return combineLatest(obsArr);
      })
    );

    this.route.paramMap.subscribe(params => { this.currentSettingSection = params['params']['section']; console.log(this.currentSettingSection); });
  }
}
