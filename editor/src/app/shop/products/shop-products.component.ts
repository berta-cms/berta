import { Component, OnInit, isDevMode } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { SiteSectionsState } from '../../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../../sites/sections/tags/section-tags.state';
import { SectionEntriesState } from '../../sites/sections/entries/entries-state/section-entries.state';
import { ShopProductsState } from './shop-products.state';
import { UpdateShopProductAction } from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';
import { SiteSectionStateModel } from 'src/app/sites/sections/sections-state/site-sections-state.model';
import { SectionTagsInterface } from 'src/app/sites/sections/tags/section-tags-state.model';
import { SectionEntry } from 'src/app/sites/sections/entries/entries-state/section-entries-state.model';


@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let group of productGroups$ | async" class="setting" [class.bt-is-empty]="group.products.length === 0">
      <h4 [class.is-tag]="group.isTag">{{ group.title }}</h4>
      <div *ngFor="let product of group.products" class="product">
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

  productGroups$: Observable<{
    name: string,
    title: string,
    isTag: boolean,
    hasProducts: boolean,
    products: any[]
  }[]>;

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.productGroups$ = combineLatest(
      this.store.select(SiteSectionsState.getCurrentSiteShopSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(SectionEntriesState.getCurrentSiteEntries),
      this.store.select(ShopProductsState.getCurrentSiteProducts)
    ).pipe(
      map(([sections, tags, entries, products]: [SiteSectionStateModel[], SectionTagsInterface[], SectionEntry[], any]) => {
        let leftOverProducts = [...products];

        // 1. Add entry data to products
        let productData: any[] = entries.reduce((_productData, entry) => {

          leftOverProducts = leftOverProducts.reduce((_prodRef, product, idx) => {
            const attributes = entry.content && entry.content.cartAttributes ? entry.content.cartAttributes.split(/,\s*/i) : [];
            const name = entry.content && entry.content.cartTitle || '';

            if (product.uniqid === entry.uniqid) {

              if ((attributes.length === 0 && product.name === name) ||
                  attributes.map(attribute => name + (name.length ? ' ' : '') + attribute).indexOf(product.name) > -1) {
                _productData.push({
                  ...product,
                  entry: entry  // make this more precise, we don't need all the properties of entry here
                });
              } else {
                // Ignore any products with this ID and not matching attributes, because they're "deleted"
              }

            } else {
              _prodRef.push(product);
            }

            return _prodRef;
          }, []);

          return _productData;
        }, []);

        // 2. Group products according to entry location in Sections and Tags
        const groups = sections.reduce((_groups, section) => {
          let sectionProducts, sectionTagProducts;

          [sectionProducts, sectionTagProducts, productData] = productData
            .reduce(([_groupProducts, _sectionTagProducts, leftOverProductData], product) => {
              if (product.entry.sectionName === section.name) {

                if ((!product.entry.tags || product.entry.tags.tag.length === 0)) {
                  _groupProducts.push(product);
                } else {
                  _sectionTagProducts.push(product);
                }

              } else {
                leftOverProductData.push(product);
              }

              return [_groupProducts, _sectionTagProducts, leftOverProductData];
            }, [[], [], []]);

          // Add section as entry group
          const sectionTags = tags.find(tag => tag['@attributes'].name === section.name && tag.tag.length > 0);
          _groups.push({
            isTag: false,
            name: section.name,
            title: section.title,
            products: sectionProducts,
            hasProducts: sectionTags && sectionTagProducts.length > 0
          });

          if (sectionTags) {
            const tagGroups = [...sectionTags.tag]
              .sort((tagA, tagB) => tagA.order - tagB.order)
              .map(tag => {
                const tagProducts = sectionTagProducts.filter((product) => {
                  return product.entry.tags.tag.some(entryTag => entryTag === tag['@value']);
                });

                return {
                  isTag: true,
                  name: tag['@attributes'].name,
                  title: tag['@value'],
                  products: tagProducts,
                  hasProducts: tagProducts.length > 0
                };
              });

              return [..._groups, ...tagGroups];
          }

          return _groups;
        }, []);

        // if (leftOverProducts.length > 0 && isDevMode()) {
        //   groups.push({
        //     title: 'No section',
        //     products: leftOverProducts
        //   });
        // }

        return groups.filter(group => group.products.length > 0 || group.hasProducts);
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
