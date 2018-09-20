import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ShopState } from './shop.state';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { Observable, combineLatest} from 'rxjs';
import { splitCamel, camel2Words, uCFirst } from '../shared/helpers';


@Component({
  selector: 'berta-shop',
  template: `
    <div *ngFor="let shopSection of shopSections$ | async">
      <a [routerLink]="['/shop', shopSection.urlSegment]"
         [style.color]="(currentShopSection === shopSection.urlSegment ? 'black': '')"><h3>{{ shopSection.title }}</h3></a>

          <berta-shop-products
            *ngIf="currentShopSection === 'products' && shopSection.urlSegment === currentShopSection">
          </berta-shop-products>
          <berta-shop-orders
            *ngIf="currentShopSection === 'orders' && shopSection.urlSegment === currentShopSection">
          </berta-shop-orders>
          <berta-shop-regional-costs
            *ngIf="currentShopSection === 'regional-costs' && shopSection.urlSegment === currentShopSection">
          </berta-shop-regional-costs>
          <berta-shop-settings
            *ngIf="currentShopSection === 'settings' && shopSection.urlSegment === currentShopSection">
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
  currentShopSection = '';
  shopSections$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store) {
  }


  ngOnInit() {
    this.shopSections$ = this.store.select(ShopState.getSections).pipe(
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

    this.route.paramMap.subscribe(params => { this.currentShopSection = params['params']['section']; });
  }
}
