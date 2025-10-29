import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, firstValueFrom, startWith } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { splitCamel, camel2Words, uCFirst } from '../shared/helpers';
import { ShopState } from './shop.state';

@Component({
  selector: 'berta-shop',
  template: `
    @for (shopSection of shopSections$ | async; track shopSection.slug) {
      <div
        class="setting-group"
        [class.is-expanded]="
          (currentShopSection$ | async) === shopSection.urlSegment
        "
      >
        <h3
          (click)="toggleSection(shopSection.urlSegment)"
          role="link"
          class="hoverable"
        >
          {{ shopSection.title }}
          <svg
            class="drop-icon"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1L4.75736 5.24264L0.514719 1"
              stroke="#9b9b9b"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h3>
        <div class="settings">
          <div>
            @if (shopSection.urlSegment === 'products') {
              <berta-shop-products></berta-shop-products>
            }
            @if (shopSection.urlSegment === 'orders') {
              <berta-shop-orders></berta-shop-orders>
            }
            @if (shopSection.urlSegment === 'regional-costs') {
              <berta-shop-regional-costs></berta-shop-regional-costs>
            }
            @if (shopSection.urlSegment === 'settings') {
              <berta-shop-settings></berta-shop-settings>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: false,
})
export class ShopComponent {
  currentShopSection$: Observable<string | null>;
  shopSections$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.currentShopSection$ = this.route.paramMap.pipe(
      map((params) => params.get('section')),
    );

    this.shopSections$ = this.store.select(ShopState.getSections).pipe(
      map((sectionSlugs: string[]) => {
        return sectionSlugs.map((sSlug) => {
          return {
            slug: sSlug,
            urlSegment: splitCamel(sSlug)
              .map((slugPeace) => slugPeace.toLowerCase())
              .join('-'),
            title: camel2Words(sSlug),
            data: {},
          };
        });
      }),
      mergeMap((sections: any[]) => {
        const obsArr = sections.map((section) => {
          return this.store
            .select((state) => {
              return (
                state['shop' + uCFirst(section.slug)] &&
                state['shop' + uCFirst(section.slug)][state.app.site]
              );
            })
            .pipe(
              startWith(null),
              map((sd) => {
                section.data = sd;
                return section;
              }),
            );
        });
        return combineLatest(obsArr);
      }),
    );
  }

  async toggleSection(sectionUrlSegment: string) {
    const currentShopSection = await firstValueFrom(this.currentShopSection$);

    if (currentShopSection === sectionUrlSegment) {
      this.router.navigate(['/shop'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/shop', sectionUrlSegment], {
        queryParamsHandling: 'preserve',
      });
    }
  }
}
