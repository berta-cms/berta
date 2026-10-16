export class UpdateShopProductAction {
  static readonly type = 'SHOP_PRODUCT:UPDATE';
  constructor(
    public id: string,
    public payload: {
      field: string;
      value: any;
    },
  ) {}
}

export class RenameShopProductSiteAction {
  static readonly type = 'SHOP_PRODUCT:SITE_RENAME';
  constructor(
    public siteName: string,
    public payload: string,
  ) {}
}

export class DeleteShopProductSiteAction {
  static readonly type = 'SHOP_PRODUCT:SITE_DELETE';
  constructor(public payload: string) {}
}

/** Loads the current site's products with their stock and reservations */
export class LoadShopProductsAction {
  static readonly type = 'SHOP_PRODUCT:LOAD';
}

/* Reset: */
export class ResetShopProductsAction {
  public static type = 'SHOP_PRODUCT:RESET';
}
