export class RenameShopOrdersSiteAction {
  static readonly type = 'SHOP_ORDERS:SITE_RENAME';
  constructor(
    public siteName: string,
    public payload: string,
  ) {}
}

export class DeleteShopOrdersSiteAction {
  static readonly type = 'SHOP_ORDERS:SITE_DELETE';
  constructor(public payload: string) {}
}

/* Init: */
export class InitShopOrdersAction {
  public static type = 'SHOP_ORDERS:INIT';
  constructor(public payload: any) {}
}

export class LoadShopOrdersPageAction {
  static readonly type = 'SHOP_ORDERS:LOAD_PAGE';
  constructor(
    public page: number,
    public statusFilter: string | null = null,
  ) {}
}

export class UpdateShopOrderStatusAction {
  static readonly type = 'SHOP_ORDERS:UPDATE_STATUS';
  constructor(
    public id: number,
    public status: string,
  ) {}
}

export class UpdateShopOrderNotesAction {
  static readonly type = 'SHOP_ORDERS:UPDATE_NOTES';
  constructor(
    public id: number,
    public notes: string,
  ) {}
}

/* Reset: */
export class ResetShopOrdersAction {
  public static type = 'SHOP_ORDERS:RESET';
}
