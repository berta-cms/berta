import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { SiteSectionsState } from '../../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../../sites/sections/tags/section-tags.state';
import { SectionEntriesState } from '../../sites/sections/entries/entries-state/section-entries.state';
import { ShopProductsState } from './shop-products.state';
import { UpdateShopProductAction } from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let group of productsData$ | async" class="setting">
      <h4 [class.is-tag]="group.isTag">{{ group.title }}</h4>
      <div *ngFor="let product of group.entries" class="product">
        <berta-text-input [value]="product.instock"
                          [label]="product.name"
                          [title]="'In stock'"
                          (update)="updateProducts('instock', $event, product.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <p>Reservations: <span>{{product.reservation}}</span></p>
      </div>
    </div>
  `
})
export class ShopProductsComponent implements OnInit {
  @Select(ShopProductsState.getCurrentSiteProducts) products$;

  productsData$: Observable<any>;  // <- @TODO create interface

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.productsData$ = combineLatest(
      this.store.select(SiteSectionsState.getCurrentSiteShopSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(SectionEntriesState.getCurrentSiteEntries),
      this.products$
    ).pipe(
      map(([sections, tags, entries, products]) => {

        entries = entries
          .filter(entry => products.some(product => product.uniqid === entry.uniqid))
          .map(entry => {
            return {...entry, ...products.find(product => product.uniqid === entry.uniqid)};
          });

        return sections
          .reduce((groups, section) => {

            // Add section as entry group
            groups = [...groups, section];
            const sectionTags = tags.find(tag => tag['@attributes'].name === section.name && tag.tag.length > 0);

            if (sectionTags) {
              // Add section tags as entry groups
              groups = [...groups, ...sectionTags.tag
                // @TODO make tag sorting work
                // .sort((a, b) => a.order - b.order)
                .map(tag => {
                  return {
                    isTag: true,
                    name: tag['@attributes'].name,
                    title: tag['@value'],
                    sectionName: section.name
                  };
                })
              ];
            }

            return groups;
          }, [])
          .map(group => {
            return {...group,
              entries: entries
                .filter(entry => {
                  if (group.isTag) {
                    return entry.sectionName === group.sectionName && entry.tags && entry.tags.tag.some(tag => tag === group.title);
                  } else {
                    return entry.sectionName === group.name && (!entry.tags || entry.tags.tag.length === 0);
                  }
                })
                .sort((a, b) => a.order - b.order)
            };
          })
          .filter(group => group.entries.length > 0);
      })
    );
  }

  updateProducts(field: string, value, id: string) {
    this.store.dispatch(new UpdateShopProductAction(id, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
