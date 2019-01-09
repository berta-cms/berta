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
        let leftOverProducts = [...products];
        let productData: any[] = entries.reduce((_productData, entry) => {

          leftOverProducts = leftOverProducts.reduce((_prodRef, product, idx) => {
            const attributes = entry.content && entry.content.cartAttributes ? entry.content.cartAttributes.split(',') : [];
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

        const groups = sections.reduce((_groups, section) => {
          let sectionProducts;

          [sectionProducts, productData] = productData.reduce(([_groupProducts, leftOverProductData], product) => {
            if (product.entry.sectionName === section.name
                && (!product.entry.tags || product.entry.tags.tag.length === 0)) {
              _groupProducts.push(product);
            } else {
              leftOverProductData.push(product);
            }

            return [_groupProducts, leftOverProductData];
          }, [[], []]);

          // Add section as entry group
          _groups.push({...section, products: sectionProducts});
          let sectionTags = tags.find(tag => tag['@attributes'].name === section.name && tag.tag.length > 0);

          if (sectionTags) {
            sectionTags = sectionTags.tag
              .map(tag => {
                let tagProducts;

                [tagProducts, productData] = productData.reduce(([_groupProducts, leftOverProductData], product) => {
                  if (product.entry.sectionName === section.name && product.entry.tags
                      && product.entry.tags.tag.some(entryTag => entryTag === tag['@value'])) {
                    _groupProducts.push(product);
                  } else {
                    leftOverProductData.push(product);
                  }

                  return [_groupProducts, leftOverProductData];
                }, [[], []]);

                return {
                  isTag: true,
                  name: tag['@attributes'].name,
                  title: tag['@value'],
                  sectionName: section.name,
                  order: tag.order,
                  products: tagProducts
                };
              }).sort((tagA, tagB) => tagA.order - tagB.order);

              return [..._groups, ...sectionTags];
          }

          return _groups;
        }, []);

        if (leftOverProducts.length > 0) {
          groups.push({
            title: 'No section',
            products: leftOverProducts
          });
        }

        return groups.filter(group => group.products.length > 0);
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
