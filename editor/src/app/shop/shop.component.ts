import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest} from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { splitCamel, camel2Words, uCFirst } from '../shared/helpers';
import { Animations } from '../shared/animations';
import { ShopState } from './shop.state';


@Component({
  selector: 'berta-shop',
  template: `
    <div class="setting-group"
         [class.is-expanded]="currentShopSection === shopSection.urlSegment"
         *ngFor="let shopSection of shopSections$ | async">
      <h3 (click)="toggleSection(shopSection.urlSegment)" role="link" class="hoverable">
        {{ shopSection.title }}
        <svg class="drop-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L4.75736 5.24264L0.514719 1" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </h3>
      <div class="settings" [@isExpanded]="currentShopSection === shopSection.urlSegment">
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
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    Animations.slideToggle
  ]
})
export class ShopComponent implements OnInit {
  currentShopSection = '';
  shopSections$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  toggleSection(sectionUrlSegment) {
    if (this.currentShopSection === sectionUrlSegment) {
      this.router.navigate(['/shop'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/shop', sectionUrlSegment], { queryParamsHandling: 'preserve' });
    }
  }
}
