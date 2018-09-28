export class RenameShopOrdersSiteAction {
  static readonly type = 'SHOP_ORDERS:SITE_RENAME';
  constructor(
    public siteName: string,
    public payload: string) {
  }
}

export class DeleteShopOrdersSiteAction {
  static readonly type = 'SHOP_ORDERS:SITE_DELETE';
  constructor(
    public payload: string) {
  }
}

export class AddShopOrdersSiteAction {
  static readonly type = 'SHOP_ORDERS:SITE_ADD';
  constructor(
    public payload: string) {
  }
}

/* Reset: */
export class ResetShopOrdersAction {
  public static type = 'SHOP_ORDERS:RESET';
}

