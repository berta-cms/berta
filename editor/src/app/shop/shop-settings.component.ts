import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopState } from './shop.state';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { splitCamel } from '../shared/helpers';


@Component({
  selector: 'berta-shop',
  template: `
    <h2>Shop</h2>
    <ul>
      <li *ngFor="let sectionSlug of sections$ | async">
        <a [routerLink]="['/shop', sectionSlug]" [style.fontWeight]="(sectionSlug === currentSection ? 'bold': '')">{{ sectionSlug }}</a>
      </li>
    </ul>
  `,
  styles: []
})
export class ShopSettingsComponent implements OnInit {
  @Select(ShopState.getSections) shopSections$;
  @Select(state => state.app) appState$;

  currentSection = '';
  sections$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.sections$ = this.shopSections$.pipe(map((sectionSlugs: string[]) => {
      return sectionSlugs.map(sectionSlug => {
        return splitCamel(sectionSlug).map(slugPeace => slugPeace.toLowerCase()).join('-');
      });
    }));
    this.route.paramMap.subscribe(params => { this.currentSection = params['params']['section']; });
  }
}
