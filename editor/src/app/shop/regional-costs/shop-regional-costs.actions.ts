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
