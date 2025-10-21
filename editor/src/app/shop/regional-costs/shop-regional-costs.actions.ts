export class UpdateShopRegionAction {
  static readonly type = 'SHOP_REGION:UPDATE';
  constructor(
    public id: number,
    public payload: {
      field: string;
      value: any;
    },
  ) {}
}

export class AddShopRegionAction {
  static readonly type = 'SHOP_REGION:ADD';
  constructor(
    public payload: {
      name: string;
      vat?: number;
    },
  ) {}
}

export class DeleteShopRegionAction {
  static readonly type = 'SHOP_REGION:DELETE';
  constructor(
    public payload: {
      id: number;
    },
  ) {}
}

/* --- Costs --- */
export class UpdateShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:UPDATE';
  constructor(
    public id: number,
    public costId: number,
    public payload: {
      field: string;
      value: any;
    },
  ) {}
}

export class AddShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:ADD';
  constructor(
    public regionId: number,
    public payload: {
      weight: number;
      price: number;
    },
  ) {}
}

export class DeleteShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:DELETE';
  constructor(
    public regionId: number,
    public payload: {
      id: number;
    },
  ) {}
}

/* Site: */
export class RenameShopRegionSiteAction {
  static readonly type = 'SHOP_REGION:SITE_RENAME';
  constructor(
    public siteName: string,
    public payload: string,
  ) {}
}

export class DeleteShopRegionSiteAction {
  static readonly type = 'SHOP_REGION:SITE_DELETE';
  constructor(public payload: string) {}
}

export class AddShopRegionSiteAction {
  static readonly type = 'SHOP_REGION:SITE_ADD';
  constructor(public payload: string) {}
}

/* Init: */
export class InitShopRegionalCostsAction {
  public static type = 'SHOP_REGIONAL_COSTS:INIT';
  constructor(public payload: any) {}
}

/* Reset: */
export class ResetShopRegionalCostsAction {
  public static type = 'SHOP_REGIONAL_COSTS:RESET';
}
