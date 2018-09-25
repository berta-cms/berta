export class UpdateShopRegionAction {
  static readonly type = 'SHOP_REGION:UPDATE';
  constructor(
    public id: number,
    public payload: {
      field: string,
      value: any
    }) {
  }
}

export class AddShopRegionAction {
  static readonly type = 'SHOP_REGION:ADD';
  constructor(
    public payload: {
      name: string,
      vat?: number
    }) {
  }
}

export class DeleteShopRegionAction {
  static readonly type = 'SHOP_REGION:DELETE';
  constructor(
    public payload: {
      id: number
    }) {
  }
}

/* --- Costs --- */
export class UpdateShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:UPDATE';
  constructor(
    public id: number,
    public costId: number,
    public payload: {
      field: string,
      value: any
    }) {
  }
}

export class AddShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:ADD';
  constructor(
    public regionId: number,
    public payload: {
      weight: number,
      price: number
    }) {
  }
}

export class DeleteShopRegionCostAction {
  static readonly type = 'SHOP_REGIONAL_COST:DELETE';
  constructor(
    public regionId: number,
    public payload: {
      id: number
    }) {
  }
}
