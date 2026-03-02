export interface CartItem {
     cI_ProductName: string;
     cI_ProductCode: string;
     cI_ImageUrl: string;
     cI_Qty: number;
     cI_UnitPrice: number;
     cI_ActualPrice: number;
     cI_TotalAmount: number;
     pqT_Value: string; // Size/Variant Label
     cI_VariantId: number;
     cI_ProductId: number;
}

export interface Cart {
  cartId: number;
  cM_TotalQty: number;
  cM_GrandTotal: number;
  cM_SubTotalAmt : number;
  cM_DiscountAmt : number;
  cM_TaxAmt : number;
  cartItems: CartItem[];
  status: number;
  msg: string | null;
}