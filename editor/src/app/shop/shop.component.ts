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
    <h2>Shop</h2>
    <ul>
      <li *ngFor="let section of sections$ | async">
        <a [routerLink]="['/shop', section.urlSegment]"
           [style.fontWeight]="(currentSection === section.urlSegment ? 'bold': '')">{{ section.title }}</a>
           <ng-container [ngSwitch]="currentSection">
             <berta-shop-products *ngSwitchCase="'products'"></berta-shop-products>
             <pre *ngSwitchCase="section.urlSegment">{{section.data | json}}</pre>
           </ng-container>
      </li>
    </ul>
  `,
  styles: []
})
export class ShopComponent implements OnInit {
  @Select(ShopState.getSections) shopSections$;
  @Select(state => state.app) appState$;

  currentSection = '';
  sections$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store) {
  }


  ngOnInit() {
    this.sections$ = this.shopSections$.pipe(
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

    this.route.paramMap.subscribe(params => { this.currentSection = params['params']['section']; console.log(this.currentSection); });
  }
}
